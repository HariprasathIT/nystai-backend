import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import DatePicker from "../date-picker.tsx";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Upload from "../../../icons/Upload icon.png";
import Uploadafter from "../../../icons/OIP.webp";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";

// ------------------ Helper Functions for Validation ------------------
const validateEmail = (email: string) => {
  if (!email) return "Email is required";
  const regex = /^[^\s@]+@[^\s@]+\.(com|org)$/;
  if (!regex.test(email)) return "Invalid email (must be .com or .org)";
  return "";
};

const validatePhone = (phone: string) => {
  if (!phone) return "Phone number is required";
  if (!/^[6-9]\d{9}$/.test(phone)) return "Phone must be 10 digits, starting with 6-9";
  return "";
};

const validateAltPhone = (alt_phone: string) => {
  if (!alt_phone) return "Alternate phone is required";
  if (!/^[6-9]\d{9}$/.test(alt_phone)) return "Alternate phone must be 10 digits, starting with 6-9";
  return "";
};

const validateAadhar = (aadhar: string) => {
  if (!aadhar) return "Aadhar is required";
  if (!/^\d{12}$/.test(aadhar)) return "Aadhar must be exactly 12 digits";
  return "";
};

const validatePAN = (pan: string) => {
  if (!pan) return "PAN is required";
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) return "Invalid PAN format (e.g. ABCDE1234F)";
  return "";
};

const validateName = (name: string) => {
  if (!name) return "Name is required";
  if (name.length < 4 || name.length > 50) return "Name must be 4-50 characters";
  if (!/^[A-Za-z]+$/.test(name)) return "Name must contain only letters";
  return "";
};

const validateLastName = (last_name: string) => {
  if (!last_name) return "Last name is required";
  if (last_name.length > 4) return "Last name must be at most 4 characters";
  if (!/^[A-Za-z\s]+$/.test(last_name)) return "Last name must contain only letters";
  return "";
};

const validateDOB = (dob: string) => {
  if (!dob) return "Date of birth is required";
  const dobDate = new Date(dob);
  if (isNaN(dobDate.getTime())) return "Invalid date";
  const age = new Date().getFullYear() - dobDate.getFullYear();
  if (age < 21) return "Student must be at least 21 years old";
  return "";
};

const validateGender = (gender: string) => {
  if (!gender) return "Gender is required";
  if (!["Male", "Female", "Other"].includes(gender)) return "Invalid gender";
  return "";
};

const validateRequired = (value: string, label: string) => {
  if (!value) return `${label} is required`;
  return "";
};

const validatePincode = (pin: string) => {
  if (!pin) return "Pincode is required";
  if (!/^[1-9][0-9]{5}$/.test(pin)) return "Pincode must be 6 digits, starting with 1-9";
  return "";
};

// ------------------ Main Form Component ------------------
export default function StudentAddForm() {
  
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    alt_phone: "",
    aadhar_number: "",
    pan_number: "",
    address: "",
    pincode: "",
    state: "",
    department: "",
    course: "",
    year_of_passed: "",
    experience: "",
    department_stream: "",
    course_duration: "",
    join_date: "",
    end_date: "",
    course_enrolled: "",
    batch: "",
    tutor: "",
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [courses, setCourses] = useState<{ id: number; course_name: string }[]>([]);

  // ------------------ Validation Before Submit ------------------
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    newErrors.name = validateName(formData.name);
    newErrors.last_name = validateLastName(formData.last_name);
    newErrors.dob = validateDOB(formData.dob);
    newErrors.gender = validateGender(formData.gender);
    newErrors.email = validateEmail(formData.email);
    newErrors.phone = validatePhone(formData.phone);
    newErrors.alt_phone = validateAltPhone(formData.alt_phone);
    newErrors.aadhar_number = validateAadhar(formData.aadhar_number);
    newErrors.pan_number = validatePAN(formData.pan_number);
    newErrors.address = validateRequired(formData.address, "Address");
    newErrors.pincode = validatePincode(formData.pincode);
    newErrors.state = validateRequired(formData.state, "State");
    newErrors.department = validateRequired(formData.department, "Department");
    newErrors.course = validateRequired(formData.course, "Course");
    newErrors.year_of_passed = validateRequired(formData.year_of_passed, "Year of Passed");
    newErrors.experience = validateRequired(formData.experience, "Experience");
    newErrors.department_stream = validateRequired(formData.department_stream, "Department Stream");
    newErrors.course_duration = validateRequired(formData.course_duration, "Course Duration");
    newErrors.join_date = validateRequired(formData.join_date, "Join Date");
    newErrors.end_date = validateRequired(formData.end_date, "End Date");
    newErrors.course_enrolled = validateRequired(formData.course_enrolled, "Course Enrolled");
    newErrors.batch = validateRequired(formData.batch, "Batch");
    newErrors.tutor = validateRequired(formData.tutor, "Tutor");

    // File validations
    if (!documents.pan_card) newErrors.pan_card = "Pan Card is required";
    if (!documents.aadhar_card) newErrors.aadhar_card = "Aadhar Card is required";
    if (!documents.sslc_marksheet) newErrors.sslc_marksheet = "SSLC Marksheet is required";
    if (!documents.passport_photo) newErrors.passport_photo = "Passport Photo is required";

    // Remove empty errors
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------ Form Submit ------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (documents.passport_photo) data.append("passport_photo", documents.passport_photo);
    if (documents.pan_card) data.append("pan_card", documents.pan_card);
    if (documents.aadhar_card) data.append("aadhar_card", documents.aadhar_card);
    if (documents.sslc_marksheet) data.append("sslc_marksheet", documents.sslc_marksheet);

    try {
      const response = await fetch("https://nystai-backend.onrender.com/insert-student", {
        method: "POST",
        body: data,
      });
      const result = await response.json();

      if (!response.ok || result.success === false) {
        toast.error("Submission failed");
        return;
      }

      toast.success("Student inserted successfully! ID: " + result.student_id);
      setFormData({
        name: "", last_name: "", dob: "", gender: "", email: "", phone: "", alt_phone: "",
        aadhar_number: "", pan_number: "", address: "", pincode: "", state: "", department: "",
        course: "", year_of_passed: "", experience: "", department_stream: "", course_duration: "",
        join_date: "", end_date: "", course_enrolled: "", batch: "", tutor: "",
      });
      setDocuments({ passport_photo: null, pan_card: null, aadhar_card: null, sslc_marksheet: null });
      setErrors({});
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    }
  };


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://nystai-backend.onrender.com/Allcourses/get-all-courses");
        const result = await response.json();
        if (result.success) {
          setCourses(result.data); // set courses into state
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, []);


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
                      value={formData.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        const onlyLetters = value.replace(/[^A-Za-z]/g, ''); // removes special chars
                        setFormData({ ...formData, name: onlyLetters });
                      }}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
                      value={formData.last_name}
                      onChange={(e) => {
                        const value = e.target.value;
                        const onlyLetters = value.replace(/[^A-Za-z]/g, ''); // allows only A-Z, a-z
                        setFormData({ ...formData, last_name: onlyLetters });
                      }}
                    />
                    {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
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
                  {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
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
                    {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
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
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // remove non-digits
                        if (value.length <= 10) {
                          setFormData({ ...formData, phone: value });
                        }
                      }}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
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
                    />
                    {errors.alt_phone && <p className="text-red-500 text-sm">{errors.alt_phone}</p>}
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
                    />
                    {errors.aadhar_number && <p className="text-red-500 text-sm">{errors.aadhar_number}</p>}
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
                      value={formData.pan_number}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase(); // auto uppercase
                        // allow only alphabets and numbers, no special chars
                        if (/^[A-Z0-9]*$/.test(value)) {
                          setFormData({ ...formData, pan_number: value });
                        }
                      }}
                    />
                    {errors.pan_number && <p className="text-red-500 text-sm">{errors.pan_number}</p>}
                  </div>
                </div>
              </div>


              <div className="space-y-6">
                <div>
                  <Label>Address</Label>
                  <div className="relative">
                    <Input placeholder="123 Street, City"
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
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
                      value={formData.pincode}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/\D/g, ''); // Remove non-digits including spaces
                        if (onlyNums.length <= 6) {
                          setFormData({ ...formData, pincode: onlyNums });
                        }
                      }}
                    />
                    {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
                  </div>
                </div>
              </div>



              <div className="space-y-6">
                <div>
                  <Label>State</Label>
                  <div className="relative">
                    <Input
                      placeholder="Tamil Nadu"
                      type="text"
                      value={formData.state}
                      onChange={(e) => {
                        const onlyChars = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                        setFormData({ ...formData, state: onlyChars });
                      }}
                    />
                    {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
                  </div>
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
                      value={formData.department}
                      onChange={(e) => {
                        const onlyLettersAndSpaces = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                        setFormData({ ...formData, department: onlyLettersAndSpaces });
                      }}
                    />
                    {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                  </div>
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
                      value={formData.course}
                      onChange={(e) =>
                        setFormData({ ...formData, course: e.target.value })
                      }
                    />
                    {errors.course && <p className="text-red-500 text-sm">{errors.course}</p>}
                  </div>
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
                      value={formData.year_of_passed}
                      onChange={(e) => {
                        const numbersOnly = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, year_of_passed: numbersOnly });
                      }}
                    />
                    {errors.year_of_passed && <p className="text-red-500 text-sm">{errors.year_of_passed}</p>}
                  </div>
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
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                    />
                    {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
                  </div>
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
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[A-Za-z]*$/.test(value)) {
                          setFormData({ ...formData, department_stream: value });
                        }
                      }}
                    />
                    {errors.department_stream && <p className="text-red-500 text-sm">{errors.department_stream}</p>}
                  </div>
                </div>
              </div>


              <div className="space-y-6">
                <div>
                  <Label>Course Duration</Label>
                  <div className="relative">
                    <Input
                      placeholder="e.g. 12"
                      type="text"
                      value={formData.course_duration}
                      onChange={(e) => {
                        const numbersOnly = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, course_duration: numbersOnly });
                      }}
                    />
                    {errors.course_duration && <p className="text-red-500 text-sm">{errors.course_duration}</p>}
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
                    }
                  }}
                />
                {errors.join_date && <p className="text-red-500 text-sm">{errors.join_date}</p>}
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
                    }
                  }}
                />
                {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date}</p>}
              </div>


            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">

              {/* Course Enrolled */}
              <div className="space-y-2">
                <Label>Course Enrolled</Label>
                <div className="relative">
                  <CustomDropdown
                    options={courses.map(course => course.course_name)} // dynamically mapped
                    value={formData.course_enrolled}
                    onSelect={(value) =>
                      setFormData({ ...formData, course_enrolled: value })
                    }
                  />
                  {errors.course_enrolled && <p className="text-red-500 text-sm">{errors.course_enrolled}</p>}
                </div>
              </div>



              <div className="space-y-2">
                <Label>Batch</Label>
                <div className="relative">
                  <Input
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
                  {errors.batch && <p className="text-red-500 text-sm">{errors.batch}</p>}
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
                  {errors.tutor && <p className="text-red-500 text-sm">{errors.tutor}</p>}
                </div>
              </div>


            </div>

            {/* Heading design */}
            <h3 className="text-l font-semibold text-[#202224] dark:text-white/90 py-4">
              Upload Documents
            </h3>


            {/* UPLOAD IMAGE */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="space-y-6">
                <Label>Pan Card</Label>
                <FileUploadBox
                  onFileSelect={(file) => setDocuments(prev => ({ ...prev, pan_card: file }))}
                  error={errors.pan_card}
                  required={true}
                />
              </div>

              <div className="space-y-6">
                <Label>Aadhar Card</Label>
                <FileUploadBox
                  onFileSelect={(file) => setDocuments(prev => ({ ...prev, aadhar_card: file }))}
                  error={errors.aadhar_card}
                  required={true}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="space-y-6">
                <Label>SSLC Marksheet</Label>
                <FileUploadBox
                  onFileSelect={(file) => setDocuments(prev => ({ ...prev, sslc_marksheet: file }))}
                  error={errors.sslc_marksheet}
                  required={true}
                />
              </div>

              <div className="space-y-6">
                <Label>Passport Size Photo</Label>
                <FileUploadBox
                  onFileSelect={(file) => setDocuments(prev => ({ ...prev, passport_photo: file }))}
                  error={errors.passport_photo}
                  required={true}
                />
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

function FileUploadBox({
  onFileSelect,
  error,
  required = false,
  submitted = false, // new prop
}: {
  onFileSelect: (file: File | null) => void;
  error?: string;
  required?: boolean;
  submitted?: boolean;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setLocalError("Only JPEG or PNG images are allowed.");
        setSelectedFile(null);
        onFileSelect(null);
        return;
      }

      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        setLocalError("File size must be less than 2MB.");
        setSelectedFile(null);
        onFileSelect(null);
        return;
      }

      setSelectedFile(file);
      setLocalError("");
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
  });

  const handleDelete = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  // ✅ Only show required error if submitted and no file selected
  useEffect(() => {
    if (required && submitted && !selectedFile) {
      setLocalError("This field is required.");
    } else if (!selectedFile) {
      setLocalError("");
    }
  }, [submitted, selectedFile, required]);

  return (
    <div>
      {selectedFile ? (
        <div className="bg-white flex justify-between items-center px-4 py-3 rounded-xl shadow border h-[176px]">
          <div className="flex items-center gap-4">
            <img src={Uploadafter} alt="Preview" className="h-12 w-12 object-contain" />
            <div>
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p>
            </div>
          </div>
          <button onClick={handleDelete} className="text-gray-500 hover:text-red-500 transition">
            <Trash2 size={18} />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`transition border border-dashed rounded-xl cursor-pointer h-[176px] p-7 lg:p-10 
          ${isDragActive ? "border-brand-500 bg-gray-100 dark:bg-gray-800" : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"}`}
        >
          <input {...getInputProps()} />
          <div className="dz-message flex flex-row items-center m-0 gap-6 h-full">
            <div className="flex justify-center items-center shrink-0">
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <img src={Upload} alt="Upload Icon" className="h-12 w-12 object-contain" />
              </div>
            </div>
            <div className="max-w-[400px] text-center">
              <h4 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                {isDragActive ? "Drop Files or" : "Drag & Drop Files or"}{" "}
                <span className="font-medium underline text-theme-sm text-brand-500">Browse File</span>
              </h4>
              <span className="block text-sm text-gray-700 dark:text-gray-400">
                Supported formats: JPEG, PNG (max 2MB)
              </span>
            </div>
          </div>
        </div>
      )}

      {(localError || error) && <p className="text-red-500 text-sm mt-1">{localError || error}</p>}
    </div>
  );
}


