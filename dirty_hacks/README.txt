Here I put all my dirty hacks. hopefuly they will become independent scripts dome day.

# listen on udp port 5070
netcat -ul 5070
# use specific interface
netcat -vv -u -l $my_ip 5070
# post to udp port
sudo sendip -p ipv4 -is $my_ip -p udp -us 5070 -ud 5070 -d "mesageeeeeeee" -v $my_ip
