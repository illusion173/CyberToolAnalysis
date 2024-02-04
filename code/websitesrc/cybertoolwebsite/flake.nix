{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/master";

    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = import nixpkgs {
            inherit system;
          };
          nodejs = pkgs.nodejs-18_x;
        in {
          devShells.default = pkgs.mkShell {
            buildInputs = [
              nodejs
              pkgs.nodePackages.npm
              
              awscli2
              nodePackages.typescript
              nodePackages.typescript-language-server
              stdenv.cc.cc.lib
            ];

            shellHook = ''
              export LD_LIBRARY_PATH=${pkgs.stdenv.cc.cc.lib}/lib:$LD_LIBRARY_PATH;
              nix run nixpkgs#patchelf -- --set-interpreter "$(nix eval nixpkgs#stdenv.cc.bintools.dynamicLinker --raw)" $HOME/.amplify/bin/amplify
            '';

          };
        }
      );
}
