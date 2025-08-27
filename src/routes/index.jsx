import { createBrowserRouter } from 'react-router-dom'

// import Users from '../../../roles/admin/components/users'
// import WebinarWrapper from '../../../roles/educator/components/WebinarWrapper'
import AdminTemplate from '../roles/admin/components/admin-layout'
import Invoices from '../roles/admin/pages/admin-invoices'
import AdminLogin from '../roles/admin/pages/admin-login'
// import EducatorLogin from '../educator-login/EducatorLogin'
import ApprovedTutors from '../roles/admin/pages/approved-tutors'
import TutorApplicants from '../roles/admin/pages/tutor-applicants'
import TutorProfile from '../roles/admin/pages/tutor-profile'
import Courses from '../roles/educator/components/courses'
import CreateCourse from '../roles/educator/components/courses/create-course'
import EditCourse from '../roles/educator/components/courses/edit-course'
import EducatorDashboard from '../roles/educator/components/Dashboard'
import EducatorLogin from '../roles/educator/components/educator-login'
import EducatorTemplate from '../roles/educator/components/educator-layout'
import PaymentHistory from '../roles/educator/components/payment-history'
import Webinar from '../roles/educator/components/Webinar'
import CreateWebinar from '../roles/educator/components/Webinar/create-webinar'
import EditWebinar from '../roles/educator/components/Webinar/edit-webinar'
import WebinarDetails from '../roles/educator/components/webinar-details'
import WebinarWrapper from '../roles/educator/components/WebinarWrapper'
import UserLayout from '../roles/user/components/user-layout'
import UserDashboard from '../roles/user/pages/user-dashboard'
import UserSettings from '../roles/user/pages/user-settings'
import AuthWrapper from '../shared/components/auth-wrapper'
import Educator from '../shared/components/auth-wrapper/educator-onboarding'
import ErrorPage from '../shared/components/error-page'
import CourseDetails from '../shared/components/layout/Course/course-details'
import Lessons from '../shared/components/layout/Course/Lessons'
import PageNotFound from '../shared/components/page-not-found'

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
      {
        path: 'educator/login',
        element: <EducatorLogin />,
      },
      {
        path: 'educator/onboarding',
        element: <Educator />,
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
        element: <TutorApplicants />,
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
    ],
  },
  {
    path: 'educator',
    element: (
      <PrivateRoute module="educator">
        <EducatorTemplate />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <EducatorDashboard />,
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
        path: 'educator-room/:roomId',
        element: <WebinarWrapper isHost />,
      },
      {
        path: 'payment-history',
        element: <PaymentHistory />,
      },
      {
        path: 'edit-webinar',
        element: <EditWebinar />,
      },
      {
        path: 'preview-webinar',
        element: <EditWebinar />,
      },
    ],
  },
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
