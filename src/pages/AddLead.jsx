import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addLead } from '../store/slices/leadsSlice';
import { Save, ArrowLeft } from 'lucide-react';

const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  phone: Yup.string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  company: Yup.string(),
  leadSource: Yup.string().required('Lead source is required'),
  notes: Yup.string(),
  serviceInterestedIn: Yup.string().required('Service interested in is required'),
  priority: Yup.string().required('Priority level is required'),
  nextFollowUpDate: Yup.date().required('Next follow-up date is required'),
  status: Yup.string().required('Status is required'),
  assignedTo: Yup.string().required('Assigned to is required')
});

const initialValues = {
  fullName: '',
  phone: '',
  email: '',
  company: '',
  leadSource: '',
  notes: '',
  serviceInterestedIn: '',
  priority: 'Medium',
  nextFollowUpDate: '',
  status: 'New',
  assignedTo: 'Sarah Johnson'
};

const AddLead = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(addLead(values));
    navigate('/leads');
    setSubmitting(false);
  };

  const leadSources = ['Referral', 'Social Media', 'Website', 'Call', 'Email', 'Event', 'Advertisement'];
  const services = ['Software Development', 'Marketing Automation', 'Consulting', 'Support Services', 'Training'];
  const priorities = ['Low', 'Medium', 'High'];
  const statuses = ['New', 'Contacted', 'Demo Scheduled', 'Meeting Scheduled', 'Not Interested', 'Converted'];
  const salesPeople = ['Sarah Johnson', 'Mike Wilson', 'David Smith', 'Lisa Chen'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/leads')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Lead</h1>
            <p className="text-gray-600 mt-2">Create a new lead and start tracking your sales opportunity</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-8">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Field
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter full name"
                    />
                    <ErrorMessage name="fullName" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <Field
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1 (555) 123-4567"
                    />
                    <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="email@example.com"
                    />
                    <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <Field
                      type="text"
                      id="company"
                      name="company"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Company name (optional)"
                    />
                    <ErrorMessage name="company" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>
              </div>

              {/* Lead Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="leadSource" className="block text-sm font-medium text-gray-700 mb-2">
                      Lead Source *
                    </label>
                    <Field
                      as="select"
                      id="leadSource"
                      name="leadSource"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select lead source</option>
                      {leadSources.map(source => (
                        <option key={source} value={source}>{source}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="leadSource" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="serviceInterestedIn" className="block text-sm font-medium text-gray-700 mb-2">
                      Service Interested In *
                    </label>
                    <Field
                      as="select"
                      id="serviceInterestedIn"
                      name="serviceInterestedIn"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select service</option>
                      {services.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="serviceInterestedIn" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level *
                    </label>
                    <Field
                      as="select"
                      id="priority"
                      name="priority"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {priorities.map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="priority" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                      Lead Status *
                    </label>
                    <Field
                      as="select"
                      id="status"
                      name="status"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="status" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
                      Assign Lead To *
                    </label>
                    <Field
                      as="select"
                      id="assignedTo"
                      name="assignedTo"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {salesPeople.map(person => (
                        <option key={person} value={person}>{person}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="assignedTo" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="nextFollowUpDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Next Follow-up Date *
                    </label>
                    <Field
                      type="date"
                      id="nextFollowUpDate"
                      name="nextFollowUpDate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="nextFollowUpDate" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes / Summary of Call
                  </label>
                  <Field
                    as="textarea"
                    id="notes"
                    name="notes"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add any relevant notes, call summary, or additional information about this lead..."
                  />
                  <ErrorMessage name="notes" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/leads')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save Lead'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddLead;