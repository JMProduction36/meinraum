{
  description = "Mein Raum Tauri/React development environment for NixOS";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
      makeDevShell = system:
        let
          pkgs = import nixpkgs { inherit system; };
          nativeTools = with pkgs; [
            nodejs_20
            rustc
            cargo
            rustfmt
            clippy
            pkg-config
            gobject-introspection
            wrapGAppsHook3
          ];
          libraries = with pkgs; [
            gtk3
            webkitgtk_4_1
            libsoup_3
            librsvg
            libayatana-appindicator
            openssl
            glib
            cairo
            pango
            atk
            gdk-pixbuf
            libxkbcommon
            wayland
            xorg.libX11
            xorg.libXcursor
            xorg.libXrandr
            xorg.libXi
            xorg.libXext
            xorg.libxcb
          ];
        in pkgs.mkShell {
          packages = nativeTools ++ libraries;
          buildInputs = libraries;
          nativeBuildInputs = nativeTools;
          PKG_CONFIG_PATH = pkgs.lib.makeSearchPath "lib/pkgconfig" (nativeTools ++ libraries);
          LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath libraries;
          GIO_EXTRA_MODULES = "${pkgs.glib-networking}/lib/gio/modules";
        };
    in {
      devShells = forAllSystems (system: {
        default = makeDevShell system;
      });
    };
}
