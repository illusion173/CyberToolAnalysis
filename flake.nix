{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/master";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay.url = "github:oxalica/rust-overlay";
  };

  outputs = { self, nixpkgs, flake-utils, rust-overlay }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };
        rust = pkgs.rust-bin.stable.latest.default.override {
          extensions = [ "rust-src" "rust-analyzer" ];
        };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Frontend
            nodejs
            nodePackages.npm
            awscli2
            nodePackages.typescript
            nodePackages.typescript-language-server
            stdenv.cc.cc.lib
            # Lambda
            rust
            zig
            pkg-config
            openssl
            stdenv.cc.cc
          ];

          shellHook = ''
            LD_LIBRARY_PATH=${pkgs.stdenv.cc.cc.lib}/lib/:$LD_LIBRARY_PATH
            LD_LIBRARY_PATH=/nix/store/l0rxwrg41k3lsdiybf8q0rf3nk430zr8-openssl-3.0.12/lib:$LD_LIBRARY_PATH
          '';
        };
      }
    );
}
