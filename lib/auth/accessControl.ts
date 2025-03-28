export const AccessControl = {
    publicPages: ['/', '/login', '/signup'],
    userPages: ['/user/dashboard', '/mypage'],
    adminPages: ['/admin/dashboard', '/admin/session-manage'],
  
    publicAPIs: ['/api/public/*'],
    userAPIs: ['/api/user/*'],
    adminAPIs: ['/api/admin/*'],
  }
  