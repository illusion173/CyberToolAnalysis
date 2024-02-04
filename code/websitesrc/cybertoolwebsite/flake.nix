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
          nodejs = pkgs.nodejs;
          nodeDependencies = (pkgs.callPackage ({ pkgs, system }:
            let nodePackages = import ./default.nix { inherit pkgs system nodejs; };
            in nodePackages // {
              # package = nodePackages.package.override {
              #   buildInputs = with pkgs; [  ];
              # };
              shell = nodePackages.shell.override {
                buildInputs = [ pkgs.nodePackages.node-gyp-build pkgs.pkg-config pkgs.cairo pkgs.pixman pkgs.pango pkgs.libpng pkgs.giflib pkgs.librsvg ];
              };
            }
            ) {}).shell.nodeDependencies;
        in
        with pkgs;
        {
          devShells.default = mkShell {
            buildInputs = [
              nodejs
              pkgs.pkg-config
              pkgs.nodePackages.node-gyp-build
              # nodeDeps."aws-amplify/cli-12.10.1"
              pkgs.nodePackages.npm
              
              pkgs.node2nix
              pkgs.awscli2
              pkgs.nodePackages.typescript
              pkgs.nodePackages.typescript-language-server
            ];

            shellHook = ''
              echo ${nodeDependencies}
            '';

            packages = [

            ]; 
          };
        }
      );
}
