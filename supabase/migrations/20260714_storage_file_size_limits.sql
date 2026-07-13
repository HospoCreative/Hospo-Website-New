update storage.buckets
set file_size_limit = 524288000,
    allowed_mime_types = array[
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'video/mp4',
      'video/webm',
      'video/quicktime'
    ]
where id = 'case-study-media';

update storage.buckets
set file_size_limit = 52428800,
    allowed_mime_types = array[
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif'
    ]
where id = 'blog-media';

update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array[
      'image/svg+xml',
      'image/png',
      'image/jpeg',
      'image/webp'
    ]
where id = 'client-logos';
