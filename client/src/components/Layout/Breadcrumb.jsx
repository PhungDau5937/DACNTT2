import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdKeyboardArrowRight } from "react-icons/md";

const Breadcrumb = () => {
  const location = useLocation();

  // Tách đường dẫn hiện tại thành các phần tử và lọc các phần tử bắt đầu bằng số
  let pathnames = location.pathname.split('/').filter((x) => x && !/^\d/.test(x));

  // Giữ lại vai trò (role) nếu có
  const roles = ['head', 'student', 'teacher'];
  const role = roles.find((r) => pathnames.includes(r));

  // Nếu có vai trò, chỉ bỏ phần tử đầu tiên
  if (role) {
    pathnames = pathnames.slice(pathnames.indexOf(role) + 1);
  }

  // Thêm vai trò vào các đường dẫn
  const buildPath = (index) => {
    const prefix = role ? `/${role}` : '';
    return `${prefix}/${pathnames.slice(0, index + 1).join('/')}`;
  };

  return (
    <nav className="flex mb-2" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center">
          <Link to={`/${role || ''}`} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = buildPath(index);

          return index === pathnames.length - 1 ? (
            <li key={to} aria-current="page">
              <div className="flex items-center dark:text-gray-400">
                <MdKeyboardArrowRight />
                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{value}</span>
              </div>
            </li>
          ) : (
            <li key={to}>
              <div className="flex items-center dark:text-gray-400">
                <MdKeyboardArrowRight />
                <Link to={to} className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                  {value}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;