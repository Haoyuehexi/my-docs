---
sidebar_position: 6
---


在phase_5处打断点

代码先判断输入的字符长度是不是6
```nasm
=> 0x000000000040107a <+24>:	call   0x40131b <string_length>
   0x000000000040107f <+29>:	cmp    $0x6,%eax
   0x0000000000401082 <+32>:	je     0x4010d2 <phase_5+112>
   0x0000000000401084 <+34>:	call   0x40143a <explode_bomb>
```
看到后面有比较字符串相等
```nasm
   0x00000000004010b3 <+81>:	mov    $0x40245e,%esi
   0x00000000004010b8 <+86>:	lea    0x10(%rsp),%rdi
   0x00000000004010bd <+91>:	call   0x401338 <strings_not_equal>
```
打印一下比较的字符串
```shell
(gdb) x/s 0x40245e
0x40245e:	"flyers"
```
中间有一段对字符串的操作，每个字符 str[i]：
(str[i] & 0xf) 取低4位，作为下标访问表 0x4024b0；
替换字符写入栈上；
最终得到的新字符串必须等于 "flyers"，否则爆炸。

```nasm
=> 0x000000000040108b <+41>:	movzbl (%rbx,%rax,1),%ecx
   0x000000000040108f <+45>:	mov    %cl,(%rsp)
   0x0000000000401092 <+48>:	mov    (%rsp),%rdx
   0x0000000000401096 <+52>:	and    $0xf,%edx
   0x0000000000401099 <+55>:	movzbl 0x4024b0(%rdx),%edx
   0x00000000004010a0 <+62>:	mov    %dl,0x10(%rsp,%rax,1)
   0x00000000004010a4 <+66>:	add    $0x1,%rax
   0x00000000004010a8 <+70>:	cmp    $0x6,%rax
   0x00000000004010ac <+74>:	jne    0x40108b <phase_5+41>
```

打印`0x4024b0`附近的数据
```shell
(gdb) x/s 0x4024b0
0x4024b0 <array.3449>:	"maduiersnfotvbylSo you think you can stop the bomb with ctrl-c, do you?"
```
所以逆推：
```
目标:   f  l  y  e  r  s
索引:   0  1  2  3  4  5
        |  |  |  |  |  |
table:  m  a  d  u  i  e  r  s  n  f  o  t  v  b  y  l
index:  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
               ↑           ↑     ↑     ↑     ↑     ↑
             'f'=9  'l'=15 'y'=14 'e'=5 'r'=6 's'=7
```
需要找到6个字符`c[0..5]`，使得：

```
c[0] & 0xf == 9   → (e.g. 'I', 'Y', 'i', 'y')
c[1] & 0xf == 15  → (e.g. 'O', 'o')
c[2] & 0xf == 14  → (e.g. 'N', 'n', '~')
c[3] & 0xf == 5   → (e.g. 'E', 'e', 'U', 'u')
c[4] & 0xf == 6   → (e.g. 'F', 'f', 'V', 'v')
c[5] & 0xf == 7   → (e.g. 'G', 'g', 'W', 'w')
```
随机组合可以得到phase_5