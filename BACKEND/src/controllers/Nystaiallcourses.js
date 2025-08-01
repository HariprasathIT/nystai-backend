import { put } from '@vercel/blob';
import db from '../config/db.js';
import pool from '../config/db.js';


// Adding courses to the database
// This function handles the course addition logic, including image upload and database insertion
export const Addingcourses = async (req, res, next) => {
  const { course_name, course_duration, card_overview } = req.body;
  const file = req.file;

  try {
    if (!file) throw new Error('Image file is required');

    // Upload buffer directly to Vercel Blob
    const blob = await put(`NystaicoursesImages/${file.originalname}`, file.buffer, {
      access: 'public',
      token: process.env.VERCEL_BLOB_RW_TOKEN,
      addRandomSuffix: true
    });

    // Insert into Neon DB 
    const result = await db.query(
      `INSERT INTO nystaiallcourses (course_name, course_duration, card_overview, image_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [course_name, course_duration, card_overview, blob.url]
    );

    res.status(201).json({
      message: 'Course added successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};


// Fetching all courses from the database
// This function retrieves all courses and their details from the database
export const getAllCourses = async (req, res, next) => {
  try {
    const result = await db.query(`SELECT * FROM nystaiallcourses ORDER BY id DESC`);
    res.status(200).json({
      message: 'Courses fetched successfully',
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};


// Deleting a course from the database
// This function handles the deletion of a course by its ID
export const deleteCourse = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if course exists
    const course = await db.query(`SELECT * FROM nystaiallcourses WHERE id = $1`, [id]);
    if (course.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete course
    await db.query(`DELETE FROM nystaiallcourses WHERE id = $1`, [id]);

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
    next(err);
  }
};


// Update a course by ID
// This function updates course details, including optional image upload
export const updateCourse = async (req, res, next) => {
  const { id } = req.params;
  const { course_name, course_duration, card_overview } = req.body;
  const file = req.file;

  try {
    let imageUrl;

    if (file) {
      const blob = await put(`NystaicoursesImages/${file.originalname}`, file.buffer, {
        access: 'public',
        token: process.env.VERCEL_BLOB_RW_TOKEN,
        addRandomSuffix: true
      });
      imageUrl = blob.url;
    }

    const query = `
      UPDATE nystaiallcourses
      SET 
        course_name = $1,
        course_duration = $2,
        card_overview = $3
        ${imageUrl ? `, image_url = $4` : ''}
      WHERE id = $${imageUrl ? 5 : 4}
      RETURNING *
    `;

    const values = imageUrl
      ? [course_name, course_duration, card_overview, imageUrl, id]
      : [course_name, course_duration, card_overview, id];

    const result = await db.query(query, values);

    res.status(200).json({
      message: 'Course updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};


// Getting a Single Course
// This function Gets a Single Courses by their Own id
export const getSingleCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM nystaiallcourses WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving course", error: err.message });
  }
};
