#!/usr/bin/env run-cargo-script
// cargo-deps: time="0.1.25"
// You can also leave off the version number, in which case, it's assumed
// to be "*".  Also, the `cargo-deps` comment *must* be a single-line
// comment, and it *must* be the first thing in the file, after the
// hashbang.
extern crate time;

pub fn add_two(a: i32) -> i32 {
    a + 2
}

fn main() {
    println!("2 plus 2 is {}", add_two(2));
    println!("{}", time::now().rfc822z());
}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_adds_two() {
        assert_eq!(5, add_two(3));
    }
}