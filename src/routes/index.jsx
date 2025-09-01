import { createBrowserRouter } from 'react-router-dom'

// Admin components
import AdminTemplate from '../roles/admin/components/admin-layout'
import Courses from '../roles/admin/components/courses'
import CreateCourse from '../roles/admin/components/courses/create-course'
import EditCourse from '../roles/admin/components/courses/edit-course'
import Webinar from '../roles/admin/components/webinars'
import CreateWebinar from '../roles/admin/components/webinars/create-webinar'
import EditWebinar from '../roles/admin/components/webinars/edit-webinar'
import Invoices from '../roles/admin/pages/admin-invoices'
import AdminLanding from '../roles/admin/pages/admin-landing'
import AdminLogin from '../roles/admin/pages/admin-login'
import AdminUsers from '../roles/admin/pages/admin-users'
import ApprovedTutors from '../roles/admin/pages/approved-tutors'
import PlatformUsers from '../roles/admin/pages/platform-users'
import TutorApplicants from '../roles/admin/pages/tutor-applicants'
import TutorProfile from '../roles/admin/pages/tutor-profile'
// User components
import UserLayout from '../roles/user/components/user-layout'
import UserDashboard from '../roles/user/pages/user-dashboard'
import UserSettings from '../roles/user/pages/user-settings'
// Shared components
import AuthWrapper from '../shared/components/auth-wrapper'
import ResetPassword from '../shared/components/auth-wrapper/reset-password'
import ErrorPage from '../shared/components/error-page'
import CourseDetails from '../shared/components/layout/Course/course-details'
import Lessons from '../shared/components/layout/Course/Lessons'
import PageNotFound from '../shared/components/page-not-found'
import WebinarWrapper from '../shared/components/webinar-room'
import WebinarDetails from '../shared/components/webinar-room/webinar-details'

import PrivateRoute from './private-route'
import PublicRoutes from './public-routes'

const Routes = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage module="publicRoutes" />,
    element: <PublicRoutes />,
    children: [
      {
        path: '',
        element: <AuthWrapper />,
      },
      {
        path: 'admin/login',
        element: <AdminLogin />,
      },
      // Educator login removed - merged with admin
      // {
      //   path: 'educator/login',
      //   element: <EducatorLogin />,
      // },
      // {
      //   path: 'educator/onboarding',
      //   element: <Educator />,
      // },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: 'dashboard',
    errorElement: <ErrorPage module="user" />,
    element: (
      <PrivateRoute module="user">
        <UserLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <UserDashboard />,
      },
      {
        path: 'webinar/:id/webinar-details',
        element: <WebinarDetails />,
      },
      {
        path: 'course/:id/course-details',
        element: <CourseDetails />,
      },
      { path: 'course/:id/lessons', element: <Lessons /> },
      { path: 'webinar/:roomId', element: <WebinarWrapper /> },
    ],
  },

  {
    path: 'admin',
    errorElement: <ErrorPage module="admin" />,
    element: (
      <PrivateRoute module="admin">
        <AdminTemplate />
      </PrivateRoute>
    ),
    children: [
      {
        path: '',
        element: <AdminLanding />,
      },
      {
        path: 'dashboard',
        element: <AdminLanding />,
      },
      {
        path: 'tutor-applicants',
        element: <TutorApplicants />,
      },
      {
        path: 'approved-tutors',
        element: <ApprovedTutors />,
      },
      {
        path: 'approved-tutors/:id',
        element: <TutorProfile />,
      },
      {
        path: 'invoices',
        element: <Invoices />,
      },
      {
        path: 'platform-users',
        element: <PlatformUsers />,
      },
      {
        path: 'admin-users',
        element: <AdminUsers />,
      },
      {
        path: 'courses',
        element: <Courses />,
      },
      {
        path: 'webinars',
        element: <Webinar />,
      },
      {
        path: 'create-course',
        element: <CreateCourse />,
      },
      {
        path: 'update-course',
        element: <EditCourse />,
      },
      {
        path: 'preview-course',
        element: <EditCourse currentStep={3} />,
      },
      {
        path: 'create-webinar',
        element: <CreateWebinar />,
      },
      {
        path: 'edit-webinar',
        element: <EditWebinar />,
      },
      {
        path: 'preview-webinar',
        element: <EditWebinar />,
      },
      {
        path: 'educator-room/:roomId',
        element: <WebinarWrapper isHost />,
      },
    ],
  },
  // Educator routes - removed as we're merging with admin
  // {
  //   path: 'educator',
  //   element: (
  //     <PrivateRoute module="educator">
  //       <EducatorTemplate />
  //     </PrivateRoute>
  //   ),
  //   children: [
  //     {
  //       index: true,
  //       element: <EducatorDashboard />,
  //     },
  //     {
  //       path: 'courses',
  //       element: <Courses />,
  //     },
  //     {
  //       path: 'webinars',
  //       element: <Webinar />,
  //     },
  //     {
  //       path: 'create-course',
  //       element: <CreateCourse />,
  //     },
  //     {
  //       path: 'update-course',
  //       element: <EditCourse />,
  //     },
  //     {
  //       path: 'preview-course',
  //       element: <EditCourse currentStep={3} />,
  //     },
  //     {
  //       path: 'create-webinar',
  //       element: <CreateWebinar />,
  //     },
  //     {
  //       path: 'educator-room/:roomId',
  //       element: <WebinarWrapper isHost />,
  //     },
  //     {
  //       path: 'payment-history',
  //       element: <PaymentHistory />,
  //     },
  //     {
  //       path: 'edit-webinar',
  //       element: <EditWebinar />,
  //     },
  //     {
  //       path: 'preview-webinar',
  //       element: <EditWebinar />,
  //     },
  //   ],
  // },
  {
    path: 'settings',
    errorElement: <ErrorPage module="user" />,
    element: (
      <PrivateRoute module="user">
        <UserLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: 'profile/:userId',
        element: <UserSettings />,
      },
    ],
  },

  {
    path: '*',
    element: <PageNotFound />,
  },
])

export default Routes
