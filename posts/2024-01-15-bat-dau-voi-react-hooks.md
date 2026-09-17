---
title: "Bắt đầu với React Hooks: useState, useEffect và useCallback"
slug: "bat-dau-voi-react-hooks"
date: "2024-01-15"
category: "Web Development"
tags: ["React", "JavaScript", "Hooks", "Frontend"]
excerpt: "Tìm hiểu các React Hooks cơ bản và cách sử dụng chúng hiệu quả trong dự án thực tế."
thumbnail: "/images/meo1.jpg"
published: true
---

React Hooks đã thay đổi hoàn toàn cách chúng ta viết component trong React kể từ phiên bản 16.8. Thay vì phải dùng class component để quản lý state và lifecycle, chúng ta có thể làm tất cả chỉ với functional component nhờ vào Hooks.

Trong bài viết này, tôi sẽ hướng dẫn bạn hiểu và sử dụng 3 Hooks quan trọng nhất: `useState`, `useEffect` và `useCallback`.

## useState — Quản lý State cục bộ

`useState` là hook đơn giản nhất, cho phép bạn thêm state vào functional component.

```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Bạn đã nhấn {count} lần</p>
      <button onClick={() => setCount(count + 1)}>
        Nhấn vào đây
      </button>
    </div>
  );
}
```

### Những điều cần lưu ý với useState

Khi state là object hoặc array, bạn cần tạo bản sao mới thay vì mutate trực tiếp:

```javascript
const [user, setUser] = useState({ name: 'Trung', age: 25 });

// ĐÚNG: tạo object mới
setUser(prev => ({ ...prev, age: 26 }));

// SAI: mutate trực tiếp — React sẽ không re-render!
user.age = 26;
setUser(user);
```

Khi cập nhật state dựa trên giá trị cũ, hãy dùng functional updater để tránh stale closure:

```javascript
setCount(prev => prev + 1); // Luôn an toàn
setCount(count + 1);        // Có thể bị stale trong async code
```

## useEffect — Xử lý Side Effects

`useEffect` thay thế các lifecycle methods: `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`. Hook này chạy sau mỗi lần render và cho phép bạn thực hiện side effects như gọi API, cập nhật DOM hay subscribe event.

```javascript
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]); // Chạy lại khi userId thay đổi

  if (loading) return <p>Đang tải...</p>;
  return <div>{user?.name}</div>;
}
```

### Cleanup trong useEffect

Khi component unmount, bạn cần dọn dẹp các subscription, timer, hoặc event listener để tránh memory leak:

```javascript
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);

  // Cleanup function — chạy khi component unmount
  return () => clearInterval(timer);
}, []);
```

### Dependency Array

- `[]` — chỉ chạy 1 lần sau lần render đầu tiên (componentDidMount)
- `[dep1, dep2]` — chạy lại khi dep1 hoặc dep2 thay đổi
- Không có array — chạy sau mỗi lần render (cẩn thận vòng lặp vô hạn!)

## useCallback — Tối ưu hiệu suất

`useCallback` memoize một function, trả về cùng một function reference nếu dependencies không thay đổi. Điều này giúp tránh re-render không cần thiết ở các child component.

```javascript
import { useState, useCallback } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);

  // handleClick chỉ tạo mới khi count thay đổi
  const handleClick = useCallback(() => {
    console.log('count hiện tại:', count);
  }, [count]);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>Tăng</button>
      <ChildComponent onClick={handleClick} />
    </div>
  );
}
```

### Khi nào nên dùng useCallback?

Chỉ nên dùng `useCallback` khi:
1. Function được truyền xuống child component được bọc bởi `React.memo`
2. Function là dependency trong `useEffect`
3. Function được dùng trong custom hook

Đừng lạm dụng `useCallback` vì bản thân nó cũng tốn memory. Premature optimization là anti-pattern!

## Kết luận

Ba hooks `useState`, `useEffect` và `useCallback` là nền tảng của React hiện đại. Nắm vững chúng sẽ giúp bạn viết code rõ ràng, dễ test và ít bug hơn. Trong bài viết tiếp theo, tôi sẽ đi sâu vào `useMemo`, `useRef` và cách tạo custom hooks cho logic dùng chung.

Nếu bạn có câu hỏi, hãy để lại comment bên dưới!
