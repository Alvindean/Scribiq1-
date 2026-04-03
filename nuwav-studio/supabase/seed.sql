-- Seed starter templates
insert into templates (name, type, niche_category, description, structure, is_public) values
(
  'Standard Online Course',
  'course',
  'education',
  'A classic course structure with intro, content modules, and outro. Perfect for skill-based training.',
  '{
    "modules": [
      {"type": "intro", "title": "Welcome & Introduction", "lesson_count": 1},
      {"type": "lesson", "title": "Module 1: Foundation", "lesson_count": 3},
      {"type": "lesson", "title": "Module 2: Core Concepts", "lesson_count": 4},
      {"type": "lesson", "title": "Module 3: Advanced Topics", "lesson_count": 3},
      {"type": "bonus", "title": "Bonus Resources", "lesson_count": 2},
      {"type": "outro", "title": "Wrap Up & Next Steps", "lesson_count": 1}
    ],
    "scene_types": ["title_card", "content", "content", "recap"],
    "default_duration_seconds": 600
  }',
  true
),
(
  'Classic VSL',
  'vsl',
  'marketing',
  'A high-converting Video Sales Letter following the Hook-Problem-Solution-Proof-Offer-CTA framework.',
  '{
    "modules": [
      {"type": "intro", "title": "Hook", "lesson_count": 1},
      {"type": "lesson", "title": "Problem & Agitation", "lesson_count": 1},
      {"type": "lesson", "title": "Solution Reveal", "lesson_count": 1},
      {"type": "testimonial", "title": "Social Proof", "lesson_count": 1},
      {"type": "cta", "title": "The Offer & Urgency", "lesson_count": 1},
      {"type": "cta", "title": "Call To Action", "lesson_count": 1}
    ],
    "scene_types": ["title_card", "content", "stat", "testimonial", "cta"],
    "default_duration_seconds": 1200
  }',
  true
),
(
  'Mini Course + VSL',
  'hybrid',
  'coaching',
  'Combine a mini course with a VSL sales page. Ideal for high-ticket coaching and consulting offers.',
  '{
    "modules": [
      {"type": "intro", "title": "VSL: Hook & Promise", "lesson_count": 1},
      {"type": "lesson", "title": "Free Value: Module 1", "lesson_count": 2},
      {"type": "lesson", "title": "Free Value: Module 2", "lesson_count": 2},
      {"type": "testimonial", "title": "Results & Proof", "lesson_count": 1},
      {"type": "cta", "title": "The Pitch", "lesson_count": 1},
      {"type": "outro", "title": "Next Steps", "lesson_count": 1}
    ],
    "scene_types": ["title_card", "content", "testimonial", "cta"],
    "default_duration_seconds": 900
  }',
  true
),
(
  'Quick Start Guide',
  'course',
  'software',
  'A short, focused course for onboarding users to a product or software tool.',
  '{
    "modules": [
      {"type": "intro", "title": "Getting Started", "lesson_count": 1},
      {"type": "lesson", "title": "Setup & Configuration", "lesson_count": 2},
      {"type": "lesson", "title": "Core Features", "lesson_count": 3},
      {"type": "lesson", "title": "Tips & Best Practices", "lesson_count": 2},
      {"type": "outro", "title": "You Are Ready!", "lesson_count": 1}
    ],
    "scene_types": ["title_card", "content", "content"],
    "default_duration_seconds": 300
  }',
  true
);
