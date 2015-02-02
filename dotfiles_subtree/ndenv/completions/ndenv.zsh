if [[ ! -o interactive ]]; then
    return
fi

compctl -K _ndenv ndenv

_ndenv() {
  local words completions
  read -cA words

  if [ "${#words}" -eq 2 ]; then
    completions="$(ndenv commands)"
  else
    completions="$(ndenv completions ${words[2,-2]})"
  fi

  reply=("${(ps:\n:)completions}")
}
