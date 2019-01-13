---
title: Getting Up and Running with the Windows Subsystem for Linux
date: 2019-01-13T16:02:39-05:00
draft: false 
tags: Windows, Linux, Bash on Windows, tmux
---

This post first appeared on: [dev.to](https://dev.to/winebaths/getting-up-and-running-with-the-windows-subsystem-for-linux-8oc)

_An exercise in futility_

![Screenfetch](https://raw.githubusercontent.com/thisisshi/dotfiles/master/screenshot-win.png)

This weekend I started tinkering around with the Windows Subsystem for Linux (WSL). I was mainly inspired to really start experimenting when I saw /u/noahnichols2008's [post](https://www.reddit.com/r/Windows10/comments/689to0/xfce4_on_windows_10/) on reddit. Here are some of my thoughts/observations.

## Background
I'm a software engineer working mainly in Python, AWS, Ansible, etc. I work on the open source cloud compliance rules engine [Cloud Custodian](https://www.github.com/capitalone/cloud-custodian) and have been doing most of my development work recently on a 2016 15" Macbook Pro. Previously, I survived through university working on a variety of Windows machines, from Windows 7, to 8, to 10, all without the WSL. During that time, I stood up multiple Ubuntu dual boots, VM's, etc. while also dipping my toes into [Vagrant](https://www.vagrantup.com/). These days, I mainly use [iTerm2](https://www.iterm2.com) as my terminal emulator of choice on macOS, [tmux](https://github.com/tmux/tmux) for logging in and out of random ec2 instances without pulling my hair out, and vim. Due to the nature of developing on and maintaining a large fleet of VM's in the cloud, I'm more familiar with doing things the GNU/Linux way than the M$FT way.

I bought myself a 12" Macbook a few weeks ago to see if I would be able to handle the small size and the controversial butterfly keyboard. Despite all the hooplah that Apple gave to the keyswitches during the announcement, I just found the keyboard to be incredibly unimpressive, annoying to type on, and unreliable. I returned it, and put the idea of buying a laptop on the back burner for a while. A few things I did like about it, however were the size, screen, and USB-C. Luckily, the Huawei Matebook X went on sale that featured all those things... but it ran Windows.

Again, I'm not a stranger to Windows. I've only relatively recently started working on macOS. For the vast majority of my life, I've used Windows in various forms: desktop, 2 in 1's, tablets, and laptops. While all my experiences with Windows has been serviceable, the development experience has been a nightmare. When Microsoft announced WSL, I was very intrigued. Running GNU/Linux basically natively in Windows? Being able to get actual work done and then being able to edit photos in Lightroom or Photoshop without having to buy a Mac or run a VM? It all sounded too good to be true. After all, isn't this the same Microsoft whose former CEO Steve Ballmer once said:

>Linux is a cancer

Well, I thought I'd give it a shot. 

## Setup
Getting WSL up and running in the first place is a pain in the ass by itself. WSL isn't enabled out of the box for some reason, possibly because Microsoft is too afraid of normies accidentally going into `cmd.exe` and typing `dir` instead of `ls`? Anyways, to get started you actually have to do a non-trivial amount of things first.

### Step 1: Update everything
If you want the latest and greatest features of the WSL, you're gonna have to spend some time doing a whole lot of nothing while Windows finds and updates itself to the latest version. This by itself is a pretty trivial effort, just go into your system settings and Check for Updates.

### Step 2: Enable the Windows Subsystem for Linux
Again, I have no idea why Microsoft would disable this by default, especially since there really isn't much of a chance that this would actually confuse someone. To actually jump into the WSL you would need to open `cmd.exe` and run `bash` which as far as I know, is enough of a barrier to entry as most normal people need. However, I digress. Hit `Start` and search for `Turn Windows Features On or Off`, then look for the Windows Subsystem for Linux and turn it on.

### Step 3: Updates 2: Electric Boogaloo
Once you've enabled the WSL, you'll then be prompted that enabling it will require another update. Go ahead and get update it. Stay strong, we're almost there.

### Step 4: (Actually) Getting Started
Now that we're completely up to date and have WSL enabled, we can finally get started. Head over to the Windows App Store and download Ubuntu (or some other flavor of GNU/Linux. As of right now, only SUSE and Ubuntu are available). That will install an app on your computer that will finally let you use Ubuntu natively(-ish) on your PC. However, that just opens up `cmd.exe` with Bash, which means you're still getting a terrible terminal emulator and an awful experience.

### Step 5: Getting it to look good.
Unlike other operating systems, there isn't exactly an over-abundance of ~good~ terminal emulators available for Windows. By default, Bash for Windows/Ubuntu will run in the equivalent of good ol' command prompt. With minimal colors and poor/no powerline font support. To combat this, we're gonna have to use something else for the time being, until Microsoft decides to bundle in a usable terminal emulator into Windows. Here are a few options:
- cmd.exe
- mintty
- cmder
- comemu
- hyper.js

Of those, I've used cmder, mintty, and hyper.js. 

The most important things I look for in a terminal emulator are:
1. Performance: I want to be able to type and see the characters move across the screen real-time. Unfortunately, this isn't necessarily a given.
2. Themeable: I'm vain. I need to have pretty colors on the screen.
3. Panes: Nice to have, but not necessary.
4. Tabs: Nice to have, but not necessary.

Hyper.js (a javascript electron based terminal emulator) is awful on Windows. It isn't that much better on macOS either. It's slow, uses a ton of system resources, and the "amazing" plugin system has a ton of issues running on Windows. Also, for some reason it doesn't like it when I use Ctrl+h to move between panes in Vim.

Cmder is ok; I haven't really used it heavily with WSL, but have had a decent experience with it in the past when I was working on Windows in university. From the time I have tinkered around with it recently, it's been a bit slow to respond when working in Vim and generally moving around the file system.

That leads us to mintty. If you want to get started with WSL, there really isn't any other choice but the [WSL Terminal](https://www.github.com/mintty/wsltty) from my perspective. It's fast (using around 5MB of ram writing this in Vim, compared to ~100MB for .hyper.js sitting at an empty screen and 35MB for cmder), has nice themeing capabilities, and is relatively full featured. To get started, simply follow the instructions in the Readme for wsltty.

### Optional Step 6: XFCE on WSL
I poked around with this a bit over a weekend and was able to get it mostly working. With this, you'll have full access to _most_ GUI GNU/Linux applications, albeit with a few caveats. 

#### Getting Started
To get started, you'll want to install a Windows X server, i.e. [XMing](https://sourceforge.net/projects/xming/), or [VcXsrv](https://sourceforge.net/projects/vcxsrv/). Install either of these to get started.

Then, add the following to your `.bashrc`, changing `/some/directory/you/specify` to your own directory:

```bash
export DISPLAY=:0
export XDG_RUNTIME_DIR=/some/directory/you/specify 
export RUNLEVEL=3
sudo mkdir /var/run/dbus
sudo dbus-daemon --config-file=/usr/share/dbus-1/system.conf
rm -rf .cache/sessions
``` 

Now, you can install XFCE:
```bash
sudo apt install xfce4
sudo apt install blueman
sudo apt install gnome-themes-standard
sudo apt-get install libcanberra-gtk3-module
```

From there, assuming everything went smoothly, you should be able to run the following and get a GUI:

```bash
xfce4-session
```

Thanks to /u/kenshen for his [post](https://www.reddit.com/r/bashonubuntuonwindows/comments/6ysgn4/guide_to_xfce4_install_in_wsl_for_advanced_noobs/) on /r/bashonubuntuonwindows

After getting all that setup, you now have access to any number of terminal emulators on GNU/Linux. However, I"ll be sticking with WSLtty for now.

## Using WSL
Now, onto actually using WSL. As mentioned before, the pain of setting up a functional and nice-to-look-at terminal emulator was a huge pain in the ass. Since the main two requirements were performance and themeable, Mintty/WSLtty seemed to cover both of those bases. However, for those coming from iTerm2 with its nice split panes and easy movement with keyboard shortcuts, this was still going to be an uphill battle. 

### Using tmux
To combat this, I started using tmux more. I had already been using tmux in the context of logging into an instance, starting tmux, and then creating splits with tmux to allow myself to run processes, attach/detach from sessions, and generally not hate my life. Since I would be moving from OS to OS and terminal emulator to terminal emulator, it made less sense for me to put the burden on myself of memorizing different keyboard shortcuts to do things that I would want across all of my environments.

Here is my `.tmux.conf`:

```config
# remap prefix from 'C-b' to 'C-a'
unbind C-b
set-option -g prefix C-a
bind-key C-a send-prefix

# split panes using d and s, a la iTerm2
bind -n M-d split-window -h
bind -n M-s split-window -v
unbind '"'
unbind %

# reload config file (change file location to your the tmux.conf you want to use)
bind r source-file ~/.tmux.conf

bind -n M-j select-pane -D 
bind -n M-k select-pane -U
bind -n M-h select-pane -L
bind -n M-l select-pane -R

set -g mouse on
set -g base-index 1
setw -g pane-base-index 1
```

Here, I switch the prefix from the default `C-b` to a more sensible `C-a` and change the split behavior to `M-d` and `M-s` (alt+d and alt+s) to better align with my habitual cmd+d pane splitting in iTerm2. I also enabled mouse movement for scrolling through history, logs, etc. and updated the `pane-base-index` to start at 1 for better ergonomics. Additionally, I've added the ability to move between panes with `hjkl` a la Vim with the `alt` modifier key. Now, I've simply added the following to my `.bashrc` to start tmux every time:

```bash 
[[ $- != *i* ]] && return
[[ -z "$TMUX" ]] && exec tmux
```

### Fish: A better shell
Now that we have some basic movement and functionality in place, it's time to upgrade our shell. Bash is great, but it lacks a lot of nice-to-haves that _can_ be fixed with adding a whole bunch of stuff to your `.bashrc` or `.bash_profile`, but I want that stuff out of the box. To get this, I use [Fish](https://fishshell.com/). Fish offers a lot of great features such as better auto-completion of commands, a package manager ([Oh My Fish](https://github.com/oh-my-fish/oh-my-fish), man page completion, and editing themes in a web based UI (which admittedly, I don't use very often)).

Installing Fish is fairly straight forward, simply:

```bash
sudo apt-get install fish
```

Then, install oh-my-fish:

```bash
curl -L https://get.oh-my.fish | fish
```

I use the agnoster theme, install with:

```bash
omf install agnoster
```

Now, all you need to do is update your shell. Supposedly WSL now supports changing shells with `chsh`, but I haven't been able to get it to work. I stick this in the bottom of my `.bashrc` (hacky, I know):

```bash
if [[ -t 1 && -x /usr/bin/fish ]]; then
    exec /usr/bin/fish
fi
```

### Additional (important) Info
Now, WSL isn't exactly 100% interop with Windows. Even something as simple as opening a file in `notepad.exe` isn't going to work out of the box. For one, Microsoft doesn't want you working with files in the WSL in Windows, this can cause issues as the file systems between the two are sufficiently different. Additionally, even looking for the WSL in explorer isn't very easy. To access your home directory, you'll have to go to: 

```shell
C:\Users\<Windows User>\AppData\Local\Packages\CanonicalGroupLimited.UbuntuonWindows_79rhkp1fndgsc\LocalState\rootfs
```

Note: Do not touch anything in here, if anything it should only be read-only.

However, there aren't restrictions on accessing files in your Windows system. Simply go to:

```shell
/mnt/c
```

From there, you'll have access to everything in you `C:/` drive, and should be able to access other drives as well.

## Conclusion
WSL is a very interesting project from Microsoft. It's very obviously trying to win over macOS users who have sworn off Windows as an operating system, instead opting for the greener fields of a unix-based operating system. Its recent [release of a command line tool to change the color scheme of `cmd.exe`](https://github.com/Microsoft/console/releases/tag/1708.14008) and moving the Ubuntu and SUSE distros to the Microsoft Store are very clearly signs of its desire to get back the developer demographic. From my time tinkering around with it, I have to say it's definitely a mixed bag. The level of effort for even getting it up and running is non-trivial, especially on a fan-less ultrabook that I'm typing on right now. Additionally, the lack of an absolutely knock-out terminal emulator to use for WSL without significant research is incredibly off-putting for those trying to get started.

There are certainly resources out there for figuring out how to get up and running, [/r/bashonubuntuonwindows](https://www.reddit.com/r/bashonubuntuonwindows) comes to mind as a decent, though somewhat spare place for answers, and their github [repo](https://www.github.com/Microsoft/WSL) certainly has answers if you're willing to dig through some Github issues. Unfortunately, it just isn't "out of the box" enough to really recommend anyone use as of right now. Especially, if you're just getting started.

If you have a great `.tmux.conf`, `.bashrc`, etc., you might be able to switch over relatively easily. But, until Microsoft fixes some of the random exant issues with things like [`dbus` not properly starting](https://github.com/Microsoft/WSL/issues/376), or [WSL randomly having issues finding certain files](https://github.com/Microsoft/WSL/issues/2448), this is kind of a futile exercise. You can certainly _get stuff done_, at the expense of spending a ton of time _getting stupid stuff done_.



