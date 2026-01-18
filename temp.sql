-- 1. Reset the Catalog (Clear old "Men/Women" data)
TRUNCATE TABLE public.saas_item_catalog CASCADE;

-- 2. Seed the Real Data (From your CSV)
INSERT INTO public.saas_item_catalog (id, name, category, is_special_suggestion) VALUES
-- WEARABLE BULK (UPPER)
('77ac0cd6-c6a7-48d7-9354-d29486fa6e58', 'T-Shirt', 'UPPER', false),
('cf93620e-efb7-450f-991f-b993d41ecff3', 'Shirt', 'UPPER', false),
('4755af9d-1b41-4b0f-8ae0-5dcfbaa6591b', 'Top', 'UPPER', false),
('593898aa-3b94-499c-8978-fc32abd8a4c5', 'Blouse', 'UPPER', false),
('59d03d7e-c3e1-4dc7-8b67-04404994338c', 'Kurta', 'UPPER', false),
('b5c1b36f-324d-454a-9aef-f7780af6a409', 'Sweatshirt', 'UPPER', false),
('621a2bdf-e188-4255-af20-6e525e166c80', 'Hoodie', 'UPPER', false),
('a8a50923-6d6d-4ac6-ac20-9b3c409e0e08', 'Sweater', 'UPPER', false),

-- WEARABLE BULK (LOWER)
('3934bb56-5650-476b-9f41-376e56d5bac9', 'Jeans', 'LOWER', false),
('c0f5e763-477d-4fa7-bf82-3b2004a3f284', 'Trousers', 'LOWER', false),
('80bca426-2418-435d-8f9d-cdaecdc5bf09', 'Shorts', 'LOWER', false),
('13d14ea4-5ad6-4c4c-bf07-7ddfbbb52b68', 'Skirt', 'LOWER', false),
('fbcd99e7-cf6a-40a8-8c67-3c0cff082ca9', 'Leggings', 'LOWER', false),
('974fbe4f-9f6d-4c3f-9d9b-271cd736b315', 'Track Pants', 'LOWER', false),
('39ea4de6-1bd3-43e6-bd4e-2fbe23d4a3d7', 'Sweatpants', 'LOWER', false),
('682c6fc1-e3b4-485b-ac28-4d7370ded042', 'Dhoti', 'LOWER', false),
('5393f924-7ddb-4656-a565-21c9f54f1fcb', 'Lungi', 'LOWER', false),

-- SPECIAL / ETHNIC (High Value Items)
('cf3a0821-b568-406a-8339-767a15b8a612', 'Saree', 'ETHNIC', true),
('e68a9229-37ee-43bc-9f53-588ea3d8d8ae', 'Lehenga ', 'ETHNIC', true),
('e08561c2-8988-4ed2-beeb-12e9367d3ade', 'Salwar Kameez Set', 'ETHNIC', true),
('41feeaeb-104a-4de9-b6dd-a4d2e1d8dc4f', 'Sherwani', 'ETHNIC', true),
('9c0c0ad7-6405-491e-a5b2-025cf5e40c4a', 'Bandhgala', 'ETHNIC', true),
('f5e1a3a1-93d4-4b48-a4ed-e1f56608dde2', 'Kurta-Pajama Set', 'ETHNIC', true),
('2015cd29-0d72-4e79-bd84-74be3d1f6b84', 'Gown', 'ETHNIC', true),
('d2e09a19-d793-4da3-aa46-308552a2d62c', 'Dhoti', 'ETHNIC', true),

-- HOME LINEN (Bulky Items)
('b69c0b95-2c40-407d-9c16-82b88c7eb5a5', 'Blanket', 'HOME_LINEN', true),
('6f8b78f9-371b-4848-83f3-758b4e398917', 'Bedsheet', 'HOME_LINEN', true),
('11451d77-da91-45cb-b0ac-1c26c51fca0f', 'Bedsheet (Double)', 'HOME_LINEN', true),
('e8304b5e-8fd9-4834-a5d8-80a552e09505', 'Pillow Cover', 'HOME_LINEN', true),
('b19ebd0d-b4ca-47a3-b1ff-56bc3051e7df', 'Sofa Covers', 'HOME_LINEN', true),
('7d4b5765-4ea3-4097-8458-e2f66fa8fcef', 'Curtains', 'HOME_LINEN', true),
('a141bf07-e166-46cc-b98f-657a80bd9833', 'Carpet / Rug', 'HOME_LINEN', true),
('29c28179-0446-46a6-bc7d-36fca68d730b', 'Bath Mat', 'HOME_LINEN', true),

-- OTHER (Accessories & Heavy Items)
('0ff5a462-957a-4f33-84e2-373022954d06', 'Shoes (Casual)', 'OTHER', true),
('6b526249-3b99-4030-9569-b9ed2e920fe3', 'Handbag', 'OTHER', true),
('d269ba2d-030e-46aa-9f5f-78132380fa64', 'Backpack', 'OTHER', true),
('618571bd-02d7-46cd-9b32-d689e2ec4a1d', 'Jacket', 'OTHER', true),
('5ede8f68-bafa-4802-998d-9932eade0844', 'Travel Bag', 'OTHER', true),
('55fa35a4-588a-40d8-8236-51e55b53440f', 'Towel', 'OTHER', true);