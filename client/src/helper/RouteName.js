export const RouteIndex = '/'
export const RouteSignIn = '/sign-in'
export const RouteSignUp = '/sign-up'
export const RouteProfile = '/profile'
export const RouteCategoryDetails = '/categories'
export const RouteAddCategory = '/categories/add'
export const RouteEditCategory = (category_id) => {
if (category_id) {
  return `/categories/edit/${category_id}`;
} else {
    return '/categories/edit/:category_id';
}
}