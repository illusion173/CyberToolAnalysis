{ pkgs }: pkgs.mkShell {
  buildInputs = with pkgs;
    with nodePackages; [
      nodejs
      node2nix
      (callPackage ./default.nix {}).shell.nodeDependencies
    ];
  shellHook = ''
    export NODE_PATH=${pkgs.callPackage ./default.nix {}.shell.nodeDependencies}/lib/node_modules
  '';
}
