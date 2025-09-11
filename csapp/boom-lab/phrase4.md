---
sidebar_position: 5
---

在phase_4处打断点
前面一段和phase_3一样判断输入数字是否是2个
```nasm
   0x0000000000401051 <+69>:	cmpl   $0x0,0xc(%rsp)
   0x0000000000401056 <+74>:	je     0x40105d <phase_4+81>
   0x0000000000401058 <+76>:	call   0x40143a <explode_bomb>
```
最后这段判读第二个值是不是0
中间调用`func4`并判断`$eax`是不是0
```shell
(gdb) disas func4
Dump of assembler code for function func4:
   0x0000000000400fce <+0>:	    sub    $0x8,%rsp
   0x0000000000400fd2 <+4>:	    mov    %edx,%eax
   0x0000000000400fd4 <+6>:	    sub    %esi,%eax
   0x0000000000400fd6 <+8>:	    mov    %eax,%ecx
   0x0000000000400fd8 <+10>:	shr    $0x1f,%ecx
   0x0000000000400fdb <+13>:	add    %ecx,%eax
   0x0000000000400fdd <+15>:	sar    $1,%eax
   0x0000000000400fdf <+17>:	lea    (%rax,%rsi,1),%ecx
   0x0000000000400fe2 <+20>:	cmp    %edi,%ecx
   0x0000000000400fe4 <+22>:	jle    0x400ff2 <func4+36>
   0x0000000000400fe6 <+24>:	lea    -0x1(%rcx),%edx
   0x0000000000400fe9 <+27>:	call   0x400fce <func4>
   0x0000000000400fee <+32>:	add    %eax,%eax
   0x0000000000400ff0 <+34>:	jmp    0x401007 <func4+57>
   0x0000000000400ff2 <+36>:	mov    $0x0,%eax
   0x0000000000400ff7 <+41>:	cmp    %edi,%ecx
   0x0000000000400ff9 <+43>:	jge    0x401007 <func4+57>
   0x0000000000400ffb <+45>:	lea    0x1(%rcx),%esi
   0x0000000000400ffe <+48>:	call   0x400fce <func4>
   0x0000000000401003 <+53>:	lea    0x1(%rax,%rax,1),%eax
   0x0000000000401007 <+57>:	add    $0x8,%rsp
   0x000000000040100b <+61>:	ret
End of assembler dump.
```
这是一个类似二分查找的路径编码变种,为了让返回值是0,只有当从根（mid）开始，一直向左递归，最终命中`target == mid`时，func4 的返回值才是 0。

所以14以内$2^m-1$的值都可以
得到phase_4
```
0 0  
1 0  
3 0
7 0 
```