---
sidebar_position: 2
---

使用gdb在phase_1处打断点
```shell
(gdb) b phase_1
Breakpoint 1 at 0x400ee0
```

输入任意字符串

进入函数
```shell
(gdb) si
0x0000000000400ee4 in phase_1 ()
```
发现汇编代码有比较字符串
```nasm
=> 0x0000000000400ee4 <+4>:	    mov    $0x402400,%esi
   0x0000000000400ee9 <+9>:	    call   0x401338 <strings_not_equal>
   0x0000000000400eee <+14>:	test   %eax,%eax
   0x0000000000400ef0 <+16>:	je     0x400ef7 <phase_1+23>
 ```

说明phase_1期望的字符串在内存地址0x402400，执行：
```shell
(gdb) x/s 0x402400
0x402400:	"Border relations with Canada have never been better."
```
得到phase_1