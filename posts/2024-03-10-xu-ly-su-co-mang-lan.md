---
title: "Hướng dẫn xử lý sự cố mạng LAN trong doanh nghiệp"
slug: "xu-ly-su-co-mang-lan"
date: "2024-03-10"
category: "IT Support"
tags: ["Networking", "IT Support", "LAN", "Troubleshooting"]
excerpt: "Quy trình chẩn đoán và xử lý các sự cố mạng LAN phổ biến trong môi trường doanh nghiệp."
thumbnail: "/images/IT1.png"
published: true
---

Trong môi trường doanh nghiệp, sự cố mạng LAN là một trong những vấn đề IT Support gặp phải thường xuyên nhất. Từ việc một máy tính không thể kết nối mạng đến cả văn phòng mất internet, mỗi tình huống đòi hỏi cách tiếp cận và chẩn đoán khác nhau.

Sau 3 năm làm IT Support và System Administrator, tôi đã tổng hợp lại quy trình xử lý sự cố mạng hiệu quả nhất mà mình đã đúc kết được.

## Nguyên tắc chẩn đoán: Từ Layer 1 đến Layer 7

Khi gặp sự cố mạng, hãy tuân theo mô hình OSI và kiểm tra từ layer thấp nhất lên:

1. **Physical Layer**: Cáp mạng, đèn LED trên switch/NIC
2. **Data Link Layer**: MAC address, ARP, VLAN
3. **Network Layer**: IP address, subnet, routing
4. **Transport Layer**: Port, firewall rules
5. **Application Layer**: DNS, HTTP, service

Nguyên tắc vàng: Đừng bỏ qua bước kiểm tra vật lý. Khoảng 30% sự cố mạng xuất phát từ cáp bị hỏng hoặc cắm không chắc.

## Bước 1: Kiểm tra vật lý (Physical Layer)

```bash
# Kiểm tra trạng thái card mạng trên Linux
ip link show
# hoặc
nmcli device status

# Trên Windows (PowerShell)
Get-NetAdapter | Select-Object Name, Status, LinkSpeed
```

Những điều cần kiểm tra:
- Đèn LED trên card mạng (NIC): xanh = kết nối, nhấp nháy = có traffic
- Đèn LED trên port switch
- Thử thay cáp mạng mới
- Thử cắm sang port switch khác

## Bước 2: Kiểm tra IP Configuration

Một trong những nguyên nhân phổ biến nhất là máy tính nhận được IP `169.254.x.x` — đây là APIPA address, có nghĩa là DHCP server không phản hồi.

```bash
# Linux
ip addr show
# Hoặc kiểm tra chi tiết
ip -4 addr show eth0

# Windows (CMD)
ipconfig /all

# Kiểm tra DHCP lease
# Linux
cat /var/lib/dhclient/dhclient.leases
# Windows
ipconfig /displaydns
```

### Xử lý khi không nhận được IP

```bash
# Thử renew DHCP
# Linux
sudo dhclient -r eth0  # Release
sudo dhclient eth0     # Request mới

# Windows
ipconfig /release
ipconfig /renew
```

## Bước 3: Kiểm tra kết nối mạng

### Test bằng ping

```bash
# Ping gateway (router)
ping 192.168.1.1

# Ping DNS server
ping 8.8.8.8

# Ping theo tên domain
ping google.com
```

Nếu ping được IP nhưng không ping được domain → vấn đề DNS.
Nếu không ping được gateway → vấn đề routing hoặc gateway.

### Traceroute — Truy vết đường đi packet

```bash
# Linux
traceroute google.com

# Windows
tracert google.com
```

## Bước 4: Kiểm tra DNS

DNS là nguyên nhân gây ra rất nhiều sự cố "không vào được web" mà thực ra mạng vẫn bình thường.

```bash
# Kiểm tra DNS resolution
nslookup google.com
nslookup google.com 8.8.8.8  # Test với DNS server cụ thể

# Linux - kiểm tra DNS config
cat /etc/resolv.conf

# Flush DNS cache
# Windows
ipconfig /flushdns

# Linux (systemd)
sudo systemd-resolve --flush-caches
```

### Giải quyết lỗi DNS

Nếu DNS công ty bị lỗi, tạm thời cấu hình DNS Google hoặc Cloudflare:
- **8.8.8.8** và **8.8.4.4** — Google DNS
- **1.1.1.1** và **1.0.0.1** — Cloudflare DNS

## Bước 5: Kiểm tra Switch và VLAN

Khi một nhóm máy cùng khu vực mất mạng nhưng khu vực khác vẫn ổn, kiểm tra switch và VLAN config.

```bash
# Kiểm tra ARP table (ai đang trong cùng subnet)
arp -a

# Kiểm tra MAC table trên switch (Cisco IOS)
show mac address-table

# Kiểm tra VLAN
show vlan brief
show interfaces trunk
```

## Công cụ hữu ích cho IT Support

Một số công cụ tôi dùng hàng ngày:

| Công cụ | Nền tảng | Tác dụng |
|---------|----------|----------|
| Wireshark | Win/Mac/Linux | Bắt và phân tích packet |
| nmap | Win/Mac/Linux | Scan port, discover host |
| NetSpot | Win/Mac | Phân tích WiFi |
| PuTTY | Windows | SSH/Telnet client |
| Advanced IP Scanner | Windows | Scan IP trong LAN |

## Quy trình xử lý sự cố toàn văn phòng mất mạng

Khi nhiều người báo mất mạng cùng lúc:

1. Kiểm tra router/firewall chính — đèn LED WAN
2. Ping gateway từ server room
3. Kiểm tra ISP có sự cố không (gọi hotline hoặc check social media)
4. Reboot router/modem (nhiều khi chỉ cần thế này là xong)
5. Kiểm tra log trên firewall/router
6. Nếu vẫn không được, failover sang kết nối backup (4G router)

## Kết luận

Xử lý sự cố mạng đòi hỏi tư duy logic và phương pháp tiếp cận có hệ thống. Quan trọng nhất là không hoảng loạn và tuân theo quy trình từ layer 1 lên. Hầu hết sự cố đều có nguyên nhân đơn giản nếu bạn biết cách tìm đúng chỗ.

Nếu bạn có tình huống cụ thể cần tư vấn, hãy comment bên dưới hoặc liên hệ trực tiếp với tôi!
