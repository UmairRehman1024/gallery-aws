- [x] add AWS DynamoDB
- [x] make ui look better
- [ ] lambda function for image processing
- [ ] add tests

- [ ] @components
- [ ] src/components/delete-button.tsx
  - [ ] Renders the button and icon.
  - [ ] Calls deleteImage on click.
  - [ ] Shows loading state while deleting.
  - [ ] Handles errors (e.g., disables button, logs error).

- [ ] src/components/delete-confirm-dialog.tsx
  - [ ] Renders dialog with correct filename.
  - [ ] Calls onConfirm when "Delete" is clicked.
  - [ ] Calls onClose when "Cancel" is clicked.

- [ ] src/components/gallery.tsx
  - [ ] Renders images grid with correct data.
  - [ ] Opens image modal on image click.
  - [ ] Shows delete button only for user's own images.
  - [ ] Handles image deletion (removes from UI after delete).
  - [ ] Shows empty state when no images.

- [ ] src/components/gallery-skeleton.tsx
  - [ ] Renders correct number of skeleton cards.

- [ ] src/components/header.tsx
  - [ ] Renders navigation links.
  - [ ] Shows upload button and user button when signed in.
  - [ ] Shows sign-in button when signed out.

- [ ] src/components/image-modal.tsx
  - [ ] Renders modal with image and metadata.
  - [ ] Calls onDelete when delete button is clicked.
  - [ ] Calls onClose when closed.

- [ ] src/components/main-nav.tsx
  - [ ] Renders navigation links.
  - [ ] Highlights active link.

- [ ] src/components/progress.tsx
  - [ ] Renders progress bar with correct value.

- [ ] src/components/switch.tsx
  - [ ] Renders switch and toggles state.

- [ ] src/components/textarea.tsx
  - [ ] Renders textarea and handles input.

- [ ] src/components/upload-form-new.tsx
  - [ ] Handles file selection, preview, and validation.
  - [ ] Handles upload flow: presign, upload, save metadata.
  - [ ] Shows progress and error/success toasts.
  - [ ] Disables submit during upload.

- [ ] src/components/upload-form.tsx
  - [ ] Handles file selection and upload.
  - [ ] Calls presign and metadata save.
  - [ ] Shows error/success toasts.

- [ ] @app

- [ ] src/app/my-gallery/page.tsx
  - [ ] Redirects/blocks if not signed in.
  - [ ] Fetches and displays user's images.
  - [ ] Renders upload button.

- [ ] src/app/upload/page.tsx
  - [ ] Renders upload form.

- [ ] src/app/api/getPresignedURL/route.ts
  - [ ] Returns presigned URL and key for valid request.
  - [ ] Handles missing/invalid input.  

- [ ] src/app/api/getImagesByUser/route.ts
  - [ ] Returns all images for a user.
  - [ ] Handles missing/invalid input.
  - [ ] Handles AWS errors gracefully.

- [ ] src/app/api/deleteImage/route.ts
  - [ ] Deletes image from S3 and DynamoDB if user is owner.    

- [ ] @server

- [ ] src/server/actions/delete-image.ts
  - [ ] Deletes image from S3 and DynamoDB if user is owner.
  - [ ] Throws error if not authenticated or not owner.
  - [ ] Throws error if image not found.

- [ ] src/server/actions/save-image-metadata.ts
  - [ ] Saves valid metadata to DynamoDB.
  - [ ] Throws error if not authenticated.
  - [ ] Validates input schema.

- [ ] src/server/queries/images.ts
  - [ ] Returns all images sorted by date.
  - [ ] Returns only user’s images for getImagesByUser.
  - [ ] Handles empty results.  

- [ ] src/server/db/index.ts
  - [ ] Initializes DynamoDB client with correct config.

- [ ] General Integration/E2E
  - [ ] Image upload flow: User uploads image, sees it in gallery.
  - [ ] Image delete flow: User deletes image, it disappears from gallery.
  - [ ] Auth flow: Only signed-in users can upload/delete.