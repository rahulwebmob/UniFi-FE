import { createBrowserRouter } from 'react-router-dom'

// import Users from '../../../roles/admin-user/components/users'
// import WebinarWrapper from '../../../roles/educator-user/components/WebinarWrapper'
import PrivateRoute from './private-route'
import PublicRoutes from './public-routes'
import Educator from '../roles/educator-user/pages'
import ErrorPage from '../shared/components/error-page'
import AuthWrapper from '../shared/components/auth-wrapper'
import PageNotFound from '../shared/components/page-not-found'
import Courses from '../roles/educator-user/components/Courses'
import Webinar from '../roles/educator-user/components/Webinar'
import Lessons from '../shared/components/layout/Course/Lessons'
import AdminLogin from '../roles/admin-user/components/admin-login'
import MyProfile from '../roles/end-user/components/my-profile'
// import EducatorLogin from '../educator-login/EducatorLogin'
import AdminTemplate from '../roles/admin-user/components/admin-template'
import DashboardLayout from '../roles/end-user/components/dashboard-layout'
import EducatorDashboard from '../roles/educator-user/components/Dashboard'
import EducatorLogin from '../roles/educator-user/components/educator-login'
import TutorApplicants from '../roles/admin-user/components/tutor-applicants'
import WebinarWrapper from '../roles/educator-user/components/WebinarWrapper'
import CourseDetails from '../shared/components/layout/Course/course-details'
import EditCourse from '../roles/educator-user/components/Courses/edit-course'
import PaymentHistory from '../roles/educator-user/components/payment-history'
import WebinarDetails from '../roles/educator-user/components/webinar-details'
import EducationInvoice from '../roles/admin-user/components/education-invoice'
import EditWebinar from '../roles/educator-user/components/Webinar/edit-webinar'
import Education from '../roles/end-user/components/education-landing/Education'
import EducatorTemplate from '../roles/educator-user/components/educator-template'
import CreateCourse from '../roles/educator-user/components/Courses/create-course'
import CreateWebinar from '../roles/educator-user/components/Webinar/create-webinar'
import TutorProfile from '../roles/admin-user/components/tutor-applicants/tutor-profile'

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
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Education />,
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
        path: 'approved-tutors',
        element: <TutorApplicants type="Approved" />,
      },
      {
        path: 'approved-tutors/:id',
        element: <TutorProfile />,
      },
      {
        path: 'tutor-applicants',
        element: <TutorApplicants />,
      },
      {
        path: 'invoices',
        element: <EducationInvoice />,
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
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: 'profile/:userId',
        element: <MyProfile />,
      },
    ],
  },

  {
    path: '*',
    element: <PageNotFound />,
  },
])

export default Routes
