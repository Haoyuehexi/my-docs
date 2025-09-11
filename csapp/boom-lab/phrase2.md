---
sidebar_position: 3
---

在phase_2处打断点
```nasm
   0x0000000000400efe <+2>:	    sub    $0x28,%rsp
   0x0000000000400f02 <+6>:	    mov    %rsp,%rsi
   0x0000000000400f05 <+9>:	    call   0x40145c <read_six_numbers>
   0x0000000000400f0a <+14>:	cmpl   $0x1,(%rsp)
   0x0000000000400f0e <+18>:	je     0x400f30 <phase_2+52>
   0x0000000000400f10 <+20>:	call   0x40143a <explode_bomb>
```
分配了0x28的栈空间，并判断第一个值是不是1

如果之前输入第一个数字不是1的话可以用set改变寄存器
```shell
(gdb) set *(int *)($rsp) = 1
(gdb) i r rsp
rsp            0x7fffffffd978      0x7fffffffd978
(gdb) x $rsp
0x7fffffffd978:	"\001"
```
循环判断后面的数字是不是前面数字的二倍

```nasm
   0x0000000000400f17 <+27>:	mov    -0x4(%rbx),%eax
   0x0000000000400f1a <+30>:	add    %eax,%eax
   0x0000000000400f1c <+32>:	cmp    %eax,(%rbx)
   0x0000000000400f1e <+34>:	je     0x400f25 <phase_2+41>
   0x0000000000400f20 <+36>:	call   0x40143a <explode_bomb>
   0x0000000000400f25 <+41>:	add    $0x4,%rbx
   0x0000000000400f29 <+45>:	cmp    %rbp,%rbx
   0x0000000000400f2c <+48>:	jne    0x400f17 <phase_2+27>
```
得到phase_2