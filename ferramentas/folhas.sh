#!/bin/bash
# junta capturas em folhas 2x2: folhas.sh <pasta-capturas> <pasta-saida>
cd "$1" && mkdir -p "$2" && rm -f "$2"/*.jpg && files=(*.jpg); n=${#files[@]}; i=0; k=0
while [ $i -lt $n ]; do a=${files[$i]}; b=${files[$((i+1))]:-$a}; c=${files[$((i+2))]:-$a}; d=${files[$((i+3))]:-$a}
ffmpeg -loglevel error -y -i $a -i $b -i $c -i $d -filter_complex "[0]scale=720:-1[a];[1]scale=720:-1[b];[2]scale=720:-1[c];[3]scale=720:-1[d];[a][b][c][d]xstack=inputs=4:layout=0_0|w0+6_0|0_h0+6|w0+6_h0+6:fill=magenta" -q:v 4 "$2"/s$(printf %02d $k).jpg
echo "s$(printf %02d $k): $a $b $c $d"; i=$((i+4)); k=$((k+1)); done
