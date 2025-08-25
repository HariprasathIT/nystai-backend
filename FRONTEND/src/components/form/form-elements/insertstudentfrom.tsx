import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import DatePicker from "../date-picker.tsx";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Upload from "../../../icons/Upload icon.png";
import Uploadafter from "../../../icons/OIP.webp";
import { toast } from 'react-hot-toast';

export default function StudentAddForm() {

  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    dob: '',
    gender: '',
    email: '',
    phone: '',
    alt_phone: '',
    aadhar_number: '',
    pan_number: '',
    address: '',
    pincode: '',
    state: '',
    department: '',
    course: '',
    year_of_passed: '',
    experience: '',
    department_stream: '',
    course_duration: '',
    join_date: '',
    end_date: '',
    course_enrolled: '',
    batch: '',
    tutor: ''
  });

  const [documents, setDocuments] = useState<{
    passport_photo: File | null;
    pan_card: File | null;
    aadhar_card: File | null;
    sslc_marksheet: File | null;
  }>({
    passport_photo: null,
    pan_card: null,
    aadhar_card: null,
    sslc_marksheet: null,
  });

  const handleSubmit = async () => {
    const data = new FormData();

    const isValid = validateForm();
    if (!isValid) {
      toast.error("Please correct the errors");
      return;
    }

    // Append text fields
    for (const key in formData) {
      data.append(key, formData[key as keyof typeof formData]);
    }

    // Check required documents
    if (
      !documents.passport_photo ||
      !documents.pan_card ||
      !documents.aadhar_card ||
      !documents.sslc_marksheet
    ) {
      toast.error("Please upload all required documents.");
      return;
    }

    data.append("passport_photo", documents.passport_photo);
    data.append("pan_card", documents.pan_card);
    data.append("aadhar_card", documents.aadhar_card);
    data.append("sslc_marksheet", documents.sslc_marksheet);

    try {
      const response = await fetch("https://nystai-backend.onrender.com/insert-student", {
        method: "POST",
        body: data,
      });

      const result = await response.json();


      if (!response.ok || result.success === false) {
        if (result.errors) {
          // Handle backend validation errors
          const fieldErrors: { [key: string]: string } = {};
          result.errors.forEach((error: { param: string; msg: string }) => {
            fieldErrors[error.param] = error.msg;
          });
          setErrors(fieldErrors);
          Object.values(fieldErrors).forEach(err => toast.error(err));
          return;
        }

        throw new Error(result.error || "Upload failed");
      }

      toast.success("Student inserted! ID: " + result.student_id);
    } catch (err) {
      console.error(err);
      toast.error("Error uploading student");
    }
  };


  const [errors, setErrors] = useState<{ [key: string]: string }>({});




  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "First name is required";
    } else if (!/^[A-Za-z]{4,30}$/.test(formData.name)) {
      newErrors.name = "Name must be 4–30 letters only";
    }

    if (!formData.last_name) {
      newErrors.last_name = "Last name is required";
    } else if (formData.last_name.length > 4) {
      newErrors.last_name = "Last name must be at most 4 characters long";
    } else if (!/^[A-Za-z\s]+$/.test(formData.last_name)) {
      newErrors.last_name = "Last name must contain only letters";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const age = new Date().getFullYear() - new Date(formData.dob).getFullYear();
      if (age < 21) {
        newErrors.dob = "Student must be at least 21 years old";
      }
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[\w-.]+@(gmail\.com|yahoo\.com|outlook\.com|[\w-]+\.org)$/.test(formData.email)
    ) {
      newErrors.email = "Invalid or unsupported email domain";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.alt_phone) {
      newErrors.alt_phone = "Alternate phone is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.alt_phone)) {
      newErrors.alt_phone = "Invalid alternate phone number";
    }

    if (!/^\d{12}$/.test(formData.aadhar_number || "")) {
      newErrors.aadhar_number = "Aadhar must be 12 digits";
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pan_number)) {
      newErrors.pan_number = "Invalid PAN number format";
    }

    if (!formData.address) newErrors.address = "Address is required";

    if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }

    if (!formData.state) newErrors.state = "State is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.course) newErrors.course = "Course is required";

    if (!/^(19|20)\d{2}$/.test(formData.year_of_passed)) {
      newErrors.year_of_passed = "Enter a valid year (e.g. 2022)";
    }

    if (!formData.experience) newErrors.experience = "Experience is required";

    if (!formData.department_stream.trim()) {
      newErrors.department_stream = "Department / Stream is required";
    } else if (!/^[A-Za-z0-9 ]+$/.test(formData.department_stream)) {
      newErrors.department_stream = "Only letters and numbers allowed. No special characters.";
    }

    if (!formData.course_duration.trim()) {
      newErrors.course_duration = "Course Duration is required";
    } else if (!/^\d+$/.test(formData.course_duration)) {
      newErrors.course_duration = "Only numbers are allowed";
    }

    if (!formData.join_date) newErrors.join_date = "Join date is required";
    if (!formData.end_date) newErrors.end_date = "End date is required";

    if (!["IOT", "CCTV"].includes(formData.course_enrolled)) {
      newErrors.course_enrolled = "Course must be IOT or CCTV";
    }

    if (!formData.batch) newErrors.batch = "Batch is required";
    if (!formData.tutor) newErrors.tutor = "Tutor is required";

    if (!documents.passport_photo) newErrors.passport_photo = "Passport photo is required";
    if (!documents.pan_card) newErrors.pan_card = "PAN card is required";
    if (!documents.aadhar_card) newErrors.aadhar_card = "Aadhar card is required";
    if (!documents.sslc_marksheet) newErrors.sslc_marksheet = "SSLC marksheet is required";

    setErrors(newErrors);

    // 🔥 Show all errors in toast
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((errMsg) => toast.error(errMsg));
      return false;
    }

    return true;
  };



  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6" >
          <div className="space-y-6" >

            {/* Heading design */}
            <h2
              className="text-xl font-semibold text-gray-800 dark:text-white/90"
              x-text="pageName"
            >
              Add Student Form
            </h2>

            <h3 className="text-l font-semibold text-[#202224] dark:text-white/90 py-4">
              Personal Details
            </h3>

            {/* input form  */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              <div className="space-y-6">
                <div>
                  <Label>First Name</Label>
                  <div className="relative">
                    <Input
                      placeholder="John"
                      type="text"
                      className={`${errors.name ? 'border border-red-500' : ''}`}
                      value={formData.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        const onlyLetters = value.replace(/[^A-Za-z]/g, ''); // removes special chars
                        setFormData({ ...formData, name: onlyLetters });
                      }}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Last Name</Label>
                  <div className="relative">
                    <Input
                      placeholder="Doe"
                      type="text"
                      className={`${errors.last_name ? 'border border-red-500' : ''}`}
                      value={formData.last_name}
                      onChange={(e) => {
                        const value = e.target.value;
                        const onlyLetters = value.replace(/[^A-Za-z]/g, ''); // allows only A-Z, a-z
                        setFormData({ ...formData, last_name: onlyLetters });
                      }}
                    />
                    {errors.last_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                    )}
                  </div>
                </div>
              </div>


              <div className="space-y-6">
                <div>
                  <Label>Date of Birth</Label>
                  <DatePicker
                    id="dob"
                    placeholder="Select date of birth"
                    maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 21))}
                    value={formData.dob ? new Date(formData.dob) : undefined}
                    onChange={(date) => {
                      const selectedDate = Array.isArray(date) ? date[0] : date;

                      if (selectedDate) {
                        const year = selectedDate.getFullYear();
                        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                        const day = String(selectedDate.getDate()).padStart(2, "0");

                        setFormData({
                          ...formData,
                          dob: `${year}-${month}-${day}`, // ✅ Local date, no timezone shift
                        });
                      } else {
                        setFormData({
                          ...formData,
                          dob: "",
                        });
                      }
                    }}
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                  )}
                </div>
              </div>



              <div className="space-y-6">
                <div>
                  <Label>
                    Gender
                  </Label>
                  <div className="relative">
                    <CustomDropdown
                      options={["Male", "Female", "Other"]}
                      value={formData.gender} //  controlled value
                      onSelect={(value) => setFormData({ ...formData, gender: value })}
                    />
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              <div className="space-y-6">
                <div>
                  <Label>Mail ID</Label>
                  <div className="relative">
                    <Input
                      placeholder="info@gmail.com"
                      type="email"
                      className={`${errors.email ? 'border border-red-500' : ''}`}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>


              <div className="space-y-6">
                <div>
                  <Label>Phone Number</Label>
                  <div className="relative">
                    <Input
                      placeholder="9876543210"
                      type="tel"
                      maxLength={10} // prevents typing more than 10
                      className={`${errors.phone ? 'border border-red-500' : ''}`}
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // remove non-digits
                        if (value.length <= 10) {
                          setFormData({ ...formData, phone: value });
                        }
                      }}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>


              <div className="space-y-6">
                <div>
                  <Label>Alternate Phone</Label>
                  <div className="relative">
                    <Input
                      placeholder="9876543211"
                      type="tel"
                      value={formData.alt_phone}
                      maxLength={10} // restrict typing to 10 digits
                      onChange={(e) => {
                        // allow only numbers & max 10 digits
                        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setFormData({ ...formData, alt_phone: value });
                      }}
                      className={`${errors.alt_phone ? 'border border-red-500' : ''}`}
                    />
                    {errors.alt_phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.alt_phone}</p>
                    )}
                  </div>
                </div>
              </div>


              <div className="space-y-6">
                <div>
                  <Label>Aadhar Number</Label>
                  <div className="relative">
                    <Input
                      placeholder="XXXX-XXXX-XXXX"
                      type="text"
                      maxLength={12} // restricts input to 12 chars
                      value={formData.aadhar_number}
                      onChange={(e) => {
                        // Allow only numbers
                        const value = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, aadhar_number: value });
                      }}
                      className={`${errors.aadhar_number ? 'border border-red-500' : ''}`}
                    />
                    {errors.aadhar_number && (
                      <p className="text-red-500 text-sm mt-1">{errors.aadhar_number}</p>
                    )}

                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              <div className="space-y-6">
                <div>
                  <Label>PAN Number</Label>
                  <div className="relative">
                    <Input
                      placeholder="ABCDE1234F"
                      type="text"
                      maxLength={10} // PAN is exactly 10 chars
                      className={`${errors.pan_number ? 'border border-red-500' : ''}`}
                      value={formData.pan_number}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase(); // auto uppercase
                        // allow only alphabets and numbers, no special chars
                        if (/^[A-Z0-9]*$/.test(value)) {
                          setFormData({ ...formData, pan_number: value });
                        }
                      }}
                    />
                    {errors.pan_number && (
                      <p className="text-red-500 text-sm mt-1">{errors.pan_number}</p>
                    )}
                  </div>
                </div>
              </div>


              <div className="space-y-6">
                <div>
                  <Label>Address</Label>
                  <div className="relative">
                    <Input placeholder="123 Street, City" type="text" className={`${errors.address ? 'border border-red-500' : ''}`} value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Pincode</Label>
                  <div className="relative">
                    <Input
                      placeholder="600001"
                      type="text"
                      inputMode="numeric"
                      pattern="\d{6}"
                      maxLength={6}
                      className={`${errors.pincode ? 'border border-red-500' : ''}`}
                      value={formData.pincode}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/\D/g, ''); // Remove non-digits including spaces
                        if (onlyNums.length <= 6) {
                          setFormData({ ...formData, pincode: onlyNums });
                        }
                      }}
                    />
                  </div>

                  {errors.pincode && (
                    <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                  )}
                </div>
              </div>



              <div className="space-y-6">
                <div>
                  <Label>State</Label>
                  <div className="relative">
                    <Input
                      placeholder="Tamil Nadu"
                      type="text"
                      className={`${errors.state ? 'border border-red-500' : ''}`}
                      value={formData.state}
                      onChange={(e) => {
                        const onlyChars = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                        setFormData({ ...formData, state: onlyChars });
                      }}
                    />
                  </div>
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
              </div>


            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              {/* Department */}
              <div className="space-y-6">
                <div>
                  <Label>Department</Label>
                  <div className="relative">
                    <Input
                      placeholder="Department Name"
                      type="text"
                      className={`${errors.department ? 'border border-red-500' : ''}`}
                      value={formData.department}
                      onChange={(e) => {
                        const onlyLettersAndSpaces = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                        setFormData({ ...formData, department: onlyLettersAndSpaces });
                      }}
                    />
                  </div>
                  {errors.department && (
                    <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                  )}
                </div>
              </div>

              {/* Course */}
              <div className="space-y-6">
                <div>
                  <Label>Course</Label>
                  <div className="relative">
                    <Input
                      placeholder="Course Name"
                      type="text"
                      className={`${errors.course ? 'border border-red-500' : ''}`}
                      value={formData.course}
                      onChange={(e) =>
                        setFormData({ ...formData, course: e.target.value })
                      }
                    />
                  </div>

                  {/* Error message */}
                  {errors.course && (
                    <p className="text-red-500 text-sm mt-1">{errors.course}</p>
                  )}
                </div>
              </div>

              {/* Year Of Passed */}
              <div className="space-y-6">
                <div>
                  <Label>Year Of Passed</Label>
                  <div className="relative">
                    <Input
                      placeholder="e.g. 2022"
                      type="text"
                      className={`${errors.year_of_passed ? 'border border-red-500' : ''}`}
                      value={formData.year_of_passed}
                      onChange={(e) => {
                        const numbersOnly = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, year_of_passed: numbersOnly });
                      }}
                    />
                  </div>

                  {/* Error message */}
                  {errors.year_of_passed && (
                    <p className="text-red-500 text-sm mt-1">{errors.year_of_passed}</p>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-6">
                <div>
                  <Label>Experience</Label>
                  <div className="relative">
                    <Input
                      placeholder="e.g. 2 years"
                      type="text"
                      className={`${errors.experience ? 'border border-red-500' : ''}`}
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                    />
                  </div>

                  {/* Error message */}
                  {errors.experience && (
                    <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Heading design */}
            <h3 className="text-l font-semibold text-[#202224] dark:text-white/90 py-4">
              Academic & Course Details
            </h3>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              <div className="space-y-6">
                <div>
                  <Label>Department / Stream</Label>
                  <div className="relative">
                    <Input
                      placeholder="e.g. ComputerScience"
                      type="text"
                      value={formData.department_stream}
                      className={`${errors.department_stream ? 'border border-red-500' : ''}`}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[A-Za-z]*$/.test(value)) {
                          setFormData({ ...formData, department_stream: value });
                        }
                      }}
                    />
                  </div>
                  {errors.department_stream && (
                    <p className="text-red-500 text-sm mt-1">{errors.department_stream}</p>
                  )}
                </div>
              </div>


              <div className="space-y-6">
                <div>
                  <Label>Course Duration</Label>
                  <div className="relative">
                    <Input
                      placeholder="e.g. 12"
                      type="text"
                      className={`${errors.course_duration ? 'border border-red-500' : ''}`}
                      value={formData.course_duration}
                      onChange={(e) => {
                        const numbersOnly = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, course_duration: numbersOnly });
                      }}
                    />
                    {errors.course_duration && (
                      <p className="text-red-500 text-sm mt-1">{errors.course_duration}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <DatePicker
                  id="join-date-picker"
                  label="Join Date"
                  placeholder="Select a date"
                  minDate={new Date()}
                  value={
                    formData.join_date && !isNaN(Date.parse(formData.join_date))
                      ? new Date(formData.join_date)
                      : undefined
                  }
                  onChange={(date) => {
                    const selectedDate = Array.isArray(date) ? date[0] : date;
                    if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
                      // Format date in local timezone (YYYY-MM-DD)
                      const year = selectedDate.getFullYear();
                      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                      const day = String(selectedDate.getDate()).padStart(2, "0");
                      const formattedDate = `${year}-${month}-${day}`;

                      setFormData((prev) => ({
                        ...prev,
                        join_date: formattedDate,
                      }));
                      setErrors((prev) => ({ ...prev, join_date: "" })); // clear error
                    }
                  }}
                />
                {errors.join_date && (
                  <p className="text-red-500 text-sm">{errors.join_date}</p>
                )}
              </div>


              <div className="space-y-2">
                <DatePicker
                  id="end-date-picker"
                  label="End Date"
                  placeholder="Select a date"
                  minDate={new Date()}
                  value={
                    formData.end_date && !isNaN(Date.parse(formData.end_date))
                      ? new Date(formData.end_date)
                      : undefined
                  }
                  onChange={(date) => {
                    const selectedDate = Array.isArray(date) ? date[0] : date;
                    if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
                      // Format in local time (YYYY-MM-DD)
                      const year = selectedDate.getFullYear();
                      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                      const day = String(selectedDate.getDate()).padStart(2, "0");
                      const formattedDate = `${year}-${month}-${day}`;

                      setFormData((prev) => ({
                        ...prev,
                        end_date: formattedDate,
                      }));
                      setErrors((prev) => ({ ...prev, end_date: "" })); // clear error
                    }
                  }}
                />
                {errors.end_date && (
                  <p className="text-red-500 text-sm">{errors.end_date}</p>
                )}
              </div>


            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">

              {/* Course Enrolled */}
              <div className="space-y-2">
                <Label>Course Enrolled</Label>
                <div className="relative">
                  <CustomDropdown
                    options={["IOT", "CCTV"]}
                    value={formData.course_enrolled}
                    onSelect={(value) =>
                      setFormData({ ...formData, course_enrolled: value })
                    }
                  />
                  {errors.course_enrolled && (
                    <p className="text-red-500 text-sm mt-1">{errors.course_enrolled}</p>
                  )}
                </div>
              </div>


              <div className="space-y-2">
                <Label>Batch</Label>
                <div className="relative">
                  <Input
                    className={`${errors.course_duration ? 'border border-red-500' : ''}`}
                    placeholder="e.g. A"
                    type="text"
                    value={formData.batch}
                    onChange={(e) => {
                      const inputValue = e.target.value.toUpperCase();
                      if (/^[A-Z]*$/.test(inputValue)) {
                        setFormData({ ...formData, batch: inputValue });
                      }
                    }}
                  />
                  {errors.batch && (
                    <p className="text-red-500 text-sm mt-1">{errors.batch}</p>
                  )}
                </div>
              </div>


              {/* Tutor */}
              <div className="space-y-2">
                <Label>Tutor</Label>
                <div className="relative">
                  <CustomDropdown
                    options={["Mohamed Yusuf Deen", "Sivaguru", "Others"]}
                    value={formData.tutor}
                    onSelect={(value) => setFormData({ ...formData, tutor: value })}
                  />
                  {errors.tutor && (
                    <p className="text-red-500 text-sm mt-1">{errors.tutor}</p>
                  )}
                </div>
              </div>


            </div>

            {/* Heading design */}
            <h3 className="text-l font-semibold text-[#202224] dark:text-white/90 py-4">
              Upload Documents
            </h3>


            {/* UPLOAD IMAGE  */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="space-y-6">
                <Label> Pan Card</Label>
                <FileUploadBox onFileSelect={(file) => setDocuments(prev => ({ ...prev, pan_card: file }))} />
                {errors.pan_card && (
                  <p className="text-red-500 text-sm mt-1">{errors.pan_card}</p>
                )}
              </div>
              <div className="space-y-6">
                <Label>Aadhar Card</Label>
                <FileUploadBox onFileSelect={(file) => setDocuments(prev => ({ ...prev, aadhar_card: file }))} />
                {errors.aadhar_card && (
                  <p className="text-red-500 text-sm mt-1">{errors.aadhar_card}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="space-y-6">
                <Label> SSLC Marksheet</Label>
                <FileUploadBox onFileSelect={(file) => setDocuments(prev => ({ ...prev, sslc_marksheet: file }))} />
                {errors.sslc_marksheet && (
                  <p className="text-red-500 text-sm mt-1">{errors.sslc_marksheet}</p>
                )}
              </div>
              <div className="space-y-6">
                <Label> Passport Size Photo</Label>
                <FileUploadBox onFileSelect={(file) => setDocuments(prev => ({ ...prev, passport_photo: file }))} />
                {errors.passport_photo && (
                  <p className="text-red-500 text-sm mt-1">{errors.passport_photo}</p>
                )}
              </div>
            </div>

            {/* BTN  */}
            <div className="grid xl:grid-cols-2 gap-6">
              <div className="col-span-full flex justify-center">
                <button onClick={handleSubmit}
                  className="flex items-center justify-center px-32 py-3 font-medium text-dark rounded-lg bg-[#F8C723] text-theme-sm hover:bg-brand-600"
                >
                  CLICK TO REGISTER
                </button>
              </div>
            </div>


          </div>
        </div>
      </div>
    </>

  );
}

// DROPDOWN COMPONENT

type CustomDropdownProps<T extends string> = {
  label?: string;
  options: T[];
  value: T; // controlled selected value
  onSelect?: (value: T) => void;
  classsName?: string;
};

function CustomDropdown<T extends string>({
  label = "Select",
  options = [],
  value,
  classsName = "",
  onSelect,
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<T | "">("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: T) => {
    setSelected(value);
    setIsOpen(false);
    onSelect?.(value);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="peer w-full appearance-none rounded-md border border-gray-300 bg-[#F5F5F5] px-4 pr-10 py-2.5 text-left text-gray-700
        focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
      >
        {value || label}
      </button>

      {/* Dropdown Icon */}
      <span
        className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
          }`}
      >
        <FontAwesomeIcon icon={faChevronDown} />
      </span>

      {/* Dropdown List */}
      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className="cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


import { useCallback } from "react";
import { Trash2 } from "lucide-react";

function FileUploadBox({ onFileSelect }: { onFileSelect: (file: File | null) => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      onFileSelect(file); // Pass file to parent
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleDelete = () => {
    setSelectedFile(null);
    onFileSelect(null); // Clear in parent
  };

  // Render uploaded file preview card
  if (selectedFile) {
    const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(1);


    return (
      <div className="bg-white flex justify-between items-center px-4 py-3 rounded-xl shadow border h-[176px]">
        <div className="flex items-center gap-4">
          {/* File icon */}
          <div className="">
            <img
              src={Uploadafter}
              alt="Preview"
              className="h-12 w-12 object-contain"
            />
          </div>
          {/* File name and size */}
          <div>
            <p className="text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">{fileSizeMB} MB</p>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="text-gray-500 hover:text-red-500 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    );
  }

  // Render upload dropzone
  return (
    <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500 h-[176px]">
      <form
        {...getRootProps()}
        className={`dropzone h-full rounded-xl border-dashed border-gray-300 p-7 lg:p-10
      ${isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"}
    `}
        id="demo-upload"
      >
        <input {...getInputProps()} />
        <div className="dz-message flex flex-row items-center m-0 gap-6 h-full">
          {/* Icon Container */}
          <div className="flex justify-center items-center shrink-0">
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full text-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <img src={Upload} alt="Upload Icon" className="h-12 w-12 object-contain" />
            </div>
          </div>

          {/* Text Content */}
          <div className="max-w-[400px] text-center">
            <h4 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {isDragActive ? "Drop Files or" : "Drag & Drop Files or"}{" "}
              <span className="font-medium underline text-theme-sm text-brand-500">
                Browse File
              </span>
            </h4>
            <span className="block text-sm text-gray-700 dark:text-gray-400">
              Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
            </span>
          </div>
        </div>
      </form>
    </div>

  );
}