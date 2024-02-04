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
              rustup
              rust-analyzer
            ];
          };
        }
      );
}
