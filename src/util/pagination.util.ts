import { IPaginationInfoType } from "../types/paginationInfo.io";

export interface IPaginationOptions {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export interface IPaginationResult<T> {
  data: T[];
  pagination: IPaginationInfoType;
}

/**
 * Hàm phân trang dùng chung cho toàn bộ dự án
 * @param model - Sequelize model để query
 * @param options - Các tùy chọn phân trang
 * @param whereCondition - Điều kiện WHERE (optional)
 * @param includeOptions - Các options include cho Sequelize (optional)
 * @returns Promise<IPaginationResult<T> | null>
 */
export const paginate = async <T>(
  model: any,
  options: IPaginationOptions = {},
  whereCondition: any = {},
  includeOptions: any[] = []
): Promise<IPaginationResult<T> | null> => {
  try {
    const {
      page = 1,
      pageSize = 5,
      orderBy = 'createdAt',
      orderDirection = 'DESC'
    } = options;

    // Lấy tổng số items với điều kiện WHERE
    const totalItems = await model.count({
      where: whereCondition
    });

    // Tính toán thông tin phân trang
    const totalPages = Math.ceil(totalItems / pageSize);
    const currentPage = page;
    const prePage = currentPage > 1 ? currentPage - 1 : 0;
    const nextPage = currentPage < totalPages ? currentPage + 1 : 0;
    const hasPrePage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    // Lấy dữ liệu với phân trang
    const data = await model.findAll({
      where: whereCondition,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      order: [[orderBy, orderDirection]],
      include: includeOptions
    });

    const pagination: IPaginationInfoType = {
      prePage,
      currentPage,
      nextPage,
      totalPages,
      totalItems,
      hasNextPage,
      hasPrePage
    };

    return {
      data: data.map((item: any) => item.dataValues || item),
      pagination
    };
  } catch (error) {
    console.error('Error in paginate function:', error);
    return null;
  }
};

/**
 * Hàm phân trang đơn giản cho các trường hợp cơ bản
 * @param model - Sequelize model
 * @param page - Số trang (default: 1)
 * @param pageSize - Kích thước trang (default: 5)
 * @param whereCondition - Điều kiện WHERE (optional)
 * @returns Promise<IPaginationResult<T> | null>
 */
export const simplePaginate = async <T>(
  model: any,
  page: number = 1,
  pageSize: number = 5,
  whereCondition: any = {}
): Promise<IPaginationResult<T> | null> => {
  return paginate<T>(model, { page, pageSize }, whereCondition);
};

/**
 * Hàm phân trang với sắp xếp tùy chỉnh
 * @param model - Sequelize model
 * @param page - Số trang
 * @param pageSize - Kích thước trang
 * @param orderBy - Trường sắp xếp
 * @param orderDirection - Hướng sắp xếp
 * @param whereCondition - Điều kiện WHERE (optional)
 * @returns Promise<IPaginationResult<T> | null>
 */
export const paginateWithOrder = async <T>(
  model: any,
  page: number,
  pageSize: number,
  orderBy: string,
  orderDirection: 'ASC' | 'DESC' = 'DESC',
  whereCondition: any = {}
): Promise<IPaginationResult<T> | null> => {
  return paginate<T>(
    model,
    { page, pageSize, orderBy, orderDirection },
    whereCondition
  );
};
