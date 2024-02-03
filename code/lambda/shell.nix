{ pkgs ? (import <nixpkgs> {
    config.allowUnfree = true;
}), ... }:

pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    rustup
    rust-analyzer
    cargo-lambda
    zig
  ];
}
