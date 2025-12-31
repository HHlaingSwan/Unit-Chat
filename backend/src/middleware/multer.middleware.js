/**
 * @file Multer Middleware
 * @description Configures Multer for handling multipart/form-data, primarily for file uploads.
 *              This middleware stores uploaded files in memory as Buffer objects.
 *              It is designed to be used in conjunction with services that require file data
 *              in-memory, such as direct uploads to cloud storage (e.g., Cloudinary) without
 *              saving the file to the local filesystem first.
 */

import multer from "multer";

/**
 * @const {StorageEngine} storage - Configures Multer to store files in memory.
 *                                   Uploaded files will be available as `Buffer` objects
 *                                   on `req.file.buffer` or `req.files[i].buffer`.
 */
const storage = multer.memoryStorage();

/**
 * @const {Multer} upload - Multer instance configured with in-memory storage.
 *                           Use this instance as middleware in Express routes to process
 *                           file uploads from `multipart/form-data` requests.
 *
 * @example
 * // In an Express route:
 * import upload from '../middleware/multer.middleware.js';
 * router.post('/upload', upload.single('image'), (req, res) => {
 *   // req.file will contain the uploaded file's information and buffer
 *   console.log(req.file);
 *   res.send('File uploaded!');
 * });
 */
const upload = multer({
  storage,
});

export default upload;