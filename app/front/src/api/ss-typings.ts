// server side typings;

export type ReviewType = {
  /**
   * id of the review
   */
  id: string;
  /**
   * Text written by the employee, the reviewer
   */
  content: string;
  /**
   * employee id for what employee it belongs
   */
  employeeId: string;
  /**
   * employee id of the writer of this review
   */
  ownerId: string;
  /**
   *  the object that contains the data of the owner of this review, the employee data
   */
  owner: EmployeeType;
};

export type EmployeeType = {
  /**
   * unique Id of the employee
   */
  id?: string;
  /**
   * name of the employee
   */
  name: string;
  /**
   * url for the photo of the employee
   */
  photoUrl: string;
  /**
   * rating for the employee
   */
  rating: number;
  /**
   * department where this employee belongs
   */
  department: string;
  /**
   * password of the employee
   * of course this should not be included in the object in a REAL application
   */
  password: string;
  /**
   * email of the employee
   */
  email: string;
  /**
   * reviews of the employee
   */
  reviews: ReviewType[];
};

export type AssetsType = {
  /**
   * Array of employees
   */
  employees: EmployeeType[];
  /**
   * Array of reviews
   */
  reviews: ReviewType[];
};

export type ApiAssetsReturnType<T extends keyof AssetsType> = {
  /**
   * number of the current page of pagination
   */
  page: number;
  /**
   * items to show on each page
   */
  perPage: number;
  /**
   * number of pages that are available before the current page
   */
  prePage: number | null;
  /**
   * number of pages that are available after the current page
   */
  nextPage: number | null;
  /**
   * Total of assets in the server
   */
  total: number;
  /**
   * number of total available pages
   */
  totalPages: number;
  /**
   * Actual data of the assets
   */
  data: AssetsType[T];
};

export type AssetsQueriesType = {
  /**
   * artificial delay for any operation/fetch function
   */
  delay?: number;
  /**
   * current page to get from the api
   */
  page?: number;
  /**
   * number of items to fetch
   */
  perPage?: number;
  /**
   * query that gets only the ids of all the assets
   */
  onlyIds?: boolean;
};
