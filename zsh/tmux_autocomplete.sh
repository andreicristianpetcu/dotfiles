#!/usr/bin/env zsh

[[ -z $TMUX ]] && return

_tmux_pane_words() {
    local expl
    local -a w
    if [[ -z "$TMUX_PANE" ]]; then
        _message "not running inside tmux!"
        return 1
    fi
    w=( ${(u)=$(tmux capture-pane \; save-buffer - \; delete-buffer)} )
    _wanted values expl 'words from current tmux pane' compadd -a w
}

tmux-enter-copy-mode() {
    if [[ -n $TMUX ]]; then
        tmux copy-mode -u
    fi
}

zle -C tmux-pane-words-prefix   complete-word _generic
zle -C tmux-pane-words-anywhere complete-word _generic
zle -N tmux-enter-copy-mode

bindkey '^X^X' tmux-pane-words-prefix
bindkey '^X^A' tmux-pane-words-anywhere

zstyle ':completion:tmux-pane-words-(prefix|anywhere):*' completer _tmux_pane_words
zstyle ':completion:tmux-pane-words-(prefix|anywhere):*' ignore-line current
zstyle ':completion:tmux-pane-words-anywhere:*' matcher-list 'b:=* m:{A-Za-z}={a-zA-Z}'
