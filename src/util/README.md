# Pagination Utility

Utility function phân trang dùng chung cho toàn bộ dự án.

## Cách sử dụng

### 1. Import utility function

```typescript
import { paginate, simplePaginate, paginateWithOrder } from "../util/pagination.util";
```

### 2. Sử dụng cơ bản

```typescript
// Phân trang đơn giản
const result = await paginate<YourModelType>(
  YourModel,
  { page: 1, pageSize: 10 }
);
```

### 3. Sử dụng với điều kiện WHERE

```typescript
const result = await paginate<YourModelType>(
  YourModel,
  { page: 1, pageSize: 10 },
  { status: 'active' } // WHERE condition
);
```

### 4. Sử dụng với sắp xếp tùy chỉnh

```typescript
const result = await paginate<YourModelType>(
  YourModel,
  { 
    page: 1, 
    pageSize: 10, 
    orderBy: 'name', 
    orderDirection: 'ASC' 
  }
);
```

### 5. Sử dụng với include (join tables)

```typescript
const result = await paginate<YourModelType>(
  YourModel,
  { page: 1, pageSize: 10 },
  {},
  [{ model: RelatedModel, as: 'related' }] // include options
);
```

## Các hàm có sẵn

### `paginate<T>(model, options, whereCondition?, includeOptions?)`

Hàm phân trang đầy đủ tính năng với tất cả tùy chọn.

### `simplePaginate<T>(model, page?, pageSize?, whereCondition?)`

Hàm phân trang đơn giản cho các trường hợp cơ bản.

### `paginateWithOrder<T>(model, page, pageSize, orderBy, orderDirection?, whereCondition?)`

Hàm phân trang với sắp xếp tùy chỉnh.

## Response Format

```typescript
{
  data: T[],                    // Dữ liệu
  pagination: {
    prePage: number,            // Trang trước
    currentPage: number,        // Trang hiện tại
    nextPage: number,          // Trang tiếp theo
    totalPages: number,        // Tổng số trang
    totalItems: number,        // Tổng số items
    hasNextPage: boolean,      // Có trang tiếp theo
    hasPrePage: boolean        // Có trang trước
  }
}
```

## Ví dụ thực tế

### ButtonLog UseCase

```typescript
const all = async (page?: number, pageSize?: number) => {
  return await paginate<ButtonLogModelType>(
    ButtonLogModelSequelize,
    { page: page || 1, pageSize: pageSize || 5, orderBy: 'createdAt', orderDirection: 'DESC' }
  );
};
```

### RealEstate Views UseCase

```typescript
const all = async (page?: number, pageSize?: number) => {
  return await paginate<RealEstateViewsModelType>(
    RealEstateViewsModelSequelize,
    { page: page || 1, pageSize: pageSize || 5, orderBy: 'createdAt', orderDirection: 'DESC' }
  );
};
```

## Lợi ích

- ✅ **Tái sử dụng**: Một function cho toàn bộ dự án
- ✅ **Type-safe**: Hỗ trợ TypeScript generics
- ✅ **Linh hoạt**: Nhiều tùy chọn cấu hình
- ✅ **Nhất quán**: Cùng format response cho tất cả API
- ✅ **Dễ bảo trì**: Chỉ cần sửa một chỗ
