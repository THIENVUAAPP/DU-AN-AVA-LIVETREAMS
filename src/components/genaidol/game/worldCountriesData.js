/**
 * 200 Quốc Gia & Vùng Lãnh Thổ Toàn Thế Giới (World Countries Dataset)
 * Kèm đầy đủ Quốc kỳ, Thủ đô, Tỉnh thành/Tiểu bang trọng điểm, Quần đảo & Toạ độ nhãn 3D
 * Phân chia theo 5 Châu Lục: Châu Á (Asia), Châu Âu (Europe), Châu Mỹ (Americas), Châu Phi (Africa), Châu Đại Dương (Oceania)
 */

export const CONTINENTS = [
  { id: 'all', name: 'Tất Cả 200 Quốc Gia 🌐' },
  { id: 'asia', name: 'Châu Á (Asia) 🌏' },
  { id: 'europe', name: 'Châu Âu (Europe) 🌍' },
  { id: 'americas', name: 'Châu Mỹ (Americas) 🌎' },
  { id: 'africa', name: 'Châu Phi (Africa) 🌍' },
  { id: 'oceania', name: 'Châu Đại Dương (Oceania) 🌏' }
];

// Helper để sinh danh sách tỉnh thành/địa danh chuẩn cho quốc gia
function createCountryDef(id, name, flag, code, continent, title, primaryColor, secondaryColor, mainCities, islands = [], customLabels = []) {
  const provinces = [
    ...mainCities.map((c, i) => ({ id: `${id}_prov_${i+1}`, name: c, totalCells: 600 })),
    ...islands.map((isl, i) => ({ id: `${id}_isl_${i+1}`, name: isl, totalCells: 350 }))
  ];

  const labels = [
    { id: `t_${id}_cap`, text: `🏛️ THỦ ĐÔ ${mainCities[0]?.toUpperCase() || name}`, wx: 0, wy: 3.5, wz: -50, color: secondaryColor || '#facc15', glow: true },
    ...(mainCities[1] ? [{ id: `t_${id}_city2`, text: `🏙️ ${mainCities[1].toUpperCase()}`, wx: -20, wy: 3.5, wz: 40, color: '#38bdf8', glow: true }] : []),
    ...(islands[0] ? [{ id: `t_${id}_isl1`, text: `🏝️ ${islands[0].toUpperCase()}`, wx: 50, wy: 3.5, wz: 80, color: '#34d399', glow: true }] : []),
    ...(islands[1] ? [{ id: `t_${id}_isl2`, text: `🏝️ ${islands[1].toUpperCase()}`, wx: 70, wy: 3.5, wz: 120, color: '#34d399', glow: true }] : []),
    ...customLabels
  ];

  return {
    id,
    name: `${name} ${flag}`,
    flag,
    code,
    continent,
    title: `${flag} ${title || (name.toUpperCase() + ' GHÉP CỜ LIVE')} ${flag}`,
    claimedCellColor: primaryColor || '#DA251D',
    starColor: secondaryColor || '#FFD700',
    emptyCellColor: '#475569',
    totalCells: 15125,
    labels,
    provinces
  };
}

// 200 Quốc Gia Chi Tiết
export const WORLD_COUNTRIES = [
  // ==================== CHÂU Á (ASIA) ====================
  createCountryDef('vietnam', 'Việt Nam', '🇻🇳', 'VN', 'asia', 'VIỆT NAM GHÉP CỜ LIVE — BẢN ĐỒ HÌNH CHỮ S', '#DA251D', '#FFD700', 
    ['Thủ Đô Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Thừa Thiên Huế', 'Hải Phòng', 'Cần Thơ', 'Khánh Hòa', 'Quảng Ninh', 'Cao Bằng', 'Cà Mau'],
    ['Quần đảo Hoàng Sa', 'Quần đảo Trường Sa', 'Đảo Phú Quốc', 'Côn Đảo', 'Đảo Bạch Long Vĩ', 'Đảo Lý Sơn'],
    [
      { id: 't_vn_hs', text: '🇻🇳 QUẦN ĐẢO HOÀNG SA', wx: 55, wy: 3.5, wz: -10, color: '#ef4444', glow: true },
      { id: 't_vn_ts', text: '🇻🇳 QUẦN ĐẢO TRƯỜNG SA', wx: 75, wy: 3.5, wz: 65, color: '#ef4444', glow: true },
      { id: 't_vn_biendong', text: '🌊 BIỂN ĐÔNG VIỆT NAM', wx: 65, wy: 3.5, wz: 25, color: '#60a5fa', glow: false },
      { id: 't_vn_slogan', text: '⭐ NON SÔNG LIỀN MỘT DẢI ⭐', wx: 0, wy: 3.5, wz: 190, color: '#fbbf24', glow: true }
    ]
  ),
  createCountryDef('japan', 'Nhật Bản', '🇯🇵', 'JP', 'asia', 'JAPAN FLAG LIVE — 日本地図', '#BC002D', '#FFFFFF',
    ['Tokyo (東京)', 'Osaka (大阪)', 'Kyoto (京都)', 'Fukuoka (福岡)', 'Nagoya (名古屋)', 'Hiroshima (広島)', 'Yokohama (横浜)'],
    ['Đảo Hokkaido (北海道)', 'Quần đảo Okinawa (沖縄)', 'Đảo Kyushu (九州)', 'Đảo Shikoku (四国)', 'Quần đảo Ogasawara']
  ),
  createCountryDef('korea', 'Hàn Quốc', '🇰🇷', 'KR', 'asia', 'KOREA FLAG LIVE — 대한민국', '#0047A0', '#CD2E3A',
    ['Seoul (서울)', 'Busan (부산)', 'Incheon (인천)', 'Daegu (대구)', 'Gwangju (광주)', 'Daejeon (대전)', 'Gyeonggi-do'],
    ['Đảo Jeju (제주도)', 'Đảo Ulleungdo (울릉도)', 'Đảo Dokdo (독도)', 'Đảo Ganghwado']
  ),
  createCountryDef('china', 'Trung Quốc', '🇨🇳', 'CN', 'asia', 'CHINA FLAG LIVE — 中华大地', '#DE2910', '#FFDE00',
    ['Bắc Kinh (Beijing)', 'Thượng Hải (Shanghai)', 'Quảng Châu (Guangzhou)', 'Thâm Quyến (Shenzhen)', 'Thành Đô (Chengdu)', 'Vũ Hán', 'Tây An'],
    ['Đảo Hải Nam (Hainan)', 'Đảo Sùng Minh', 'Đảo Chu Sơn', 'Quần đảo Vạn Sơn']
  ),
  createCountryDef('thailand', 'Thái Lan', '🇹🇭', 'TH', 'asia', 'THAILAND FLAG LIVE — ประเทศไทย', '#2D2A4A', '#A51931',
    ['Bangkok (Krung Thep)', 'Chiang Mai', 'Phuket', 'Pattaya (Chonburi)', 'Ayutthaya', 'Khon Kaen', 'Nakhon Ratchasima'],
    ['Đảo Phuket', 'Đảo Koh Samui', 'Đảo Koh Phi Phi', 'Đảo Koh Chang', 'Quần đảo Similan']
  ),
  createCountryDef('singapore', 'Singapore', '🇸🇬', 'SG', 'asia', 'SINGAPORE FLAG LIVE — LION CITY', '#ED2939', '#FFFFFF',
    ['Singapore Downtown', 'Marina Bay', 'Orchard Road', 'Jurong', 'Changi', 'Woodlands'],
    ['Đảo Sentosa', 'Đảo Pulau Ubin', 'Đảo Pulau Tekong', 'Đảo Kusu']
  ),
  createCountryDef('malaysia', 'Malaysia', '🇲🇾', 'MY', 'asia', 'MALAYSIA FLAG LIVE — JALUR GEMILANG', '#010066', '#CC0000',
    ['Kuala Lumpur', 'Penang (George Town)', 'Johor Bahru', 'Malacca', 'Kota Kinabalu (Sabah)', 'Kuching (Sarawak)', 'Ipoh'],
    ['Đảo Penang', 'Quần đảo Langkawi', 'Đảo Labuan', 'Đảo Tioman', 'Đảo Redang', 'Đảo Sipadan']
  ),
  createCountryDef('indonesia', 'Indonesia', '🇮🇩', 'ID', 'asia', 'INDONESIA FLAG LIVE — NUSANTARA', '#FF0000', '#FFFFFF',
    ['Jakarta', 'Nusantara (Thủ đô mới)', 'Surabaya', 'Bandung', 'Medan', 'Yogyakarta', 'Semarang'],
    ['Đảo Bali', 'Đảo Sumatra', 'Đảo Java', 'Đảo Kalimantan (Borneo)', 'Đảo Sulawesi', 'Đảo Papua', 'Quần đảo Komodo']
  ),
  createCountryDef('philippines', 'Philippines', '🇵🇭', 'PH', 'asia', 'PHILIPPINES FLAG LIVE — 7100 ISLANDS', '#0038A8', '#CE1126',
    ['Manila', 'Quezon City', 'Cebu City', 'Davao City', 'Bagio', 'Iloilo City'],
    ['Đảo Luzon', 'Đảo Mindanao', 'Đảo Boracay', 'Đảo Palawan', 'Đảo Siargao', 'Đảo Bohol']
  ),
  createCountryDef('india', 'Ấn Độ', '🇮🇳', 'IN', 'asia', 'INDIA FLAG LIVE — BHARAT', '#FF9933', '#138808',
    ['New Delhi', 'Mumbai', 'Bengaluru (Bangalore)', 'Chennai', 'Kolkata', 'Hyderabad', 'Jaipur'],
    ['Quần đảo Andaman & Nicobar', 'Quần đảo Lakshadweep', 'Đảo Elephanta', 'Đảo Majuli']
  ),
  createCountryDef('laos', 'Lào', '🇱🇦', 'LA', 'asia', 'LAOS FLAG LIVE — ສປປ ລາວ', '#002868', '#CE1126',
    ['Vientiane (Viêng Chăn)', 'Luang Prabang', 'Pakse', 'Savannakhet', 'Vang Vieng', 'Champasak'],
    ['Quần đảo Si Phan Don (4000 Đảo)', 'Đảo Khong', 'Đảo Det']
  ),
  createCountryDef('cambodia', 'Campuchia', '🇰🇭', 'KH', 'asia', 'CAMBODIA FLAG LIVE — ព្រះរាជាណាចក្រកម្ពុជា', '#032EA1', '#E00025',
    ['Phnom Penh', 'Siem Reap (Angkor)', 'Sihanoukville', 'Battambang', 'Kampot', 'Koh Kong'],
    ['Đảo Koh Rong', 'Đảo Koh Rong Sanloem', 'Đảo Koh Russey', 'Đảo Koh Sdach']
  ),
  createCountryDef('myanmar', 'Myanmar', '🇲🇲', 'MM', 'asia', 'MYANMAR FLAG LIVE — ပြည်ထောင်စု မြန်မာ', '#FECB00', '#34B233',
    ['Naypyidaw', 'Yangon (Rangoon)', 'Mandalay', 'Bagan', 'Taunggyi', 'Mawlamyine'],
    ['Quần đảo Mergui (800 đảo)', 'Đảo Ramree', 'Đảo Manaung']
  ),
  createCountryDef('taiwan', 'Đài Loan', '🇹🇼', 'TW', 'asia', 'TAIWAN FLAG LIVE — 臺灣', '#FE0000', '#000095',
    ['Đài Bắc (Taipei)', 'Cao Hùng (Kaohsiung)', 'Đài Trung (Taichung)', 'Đài Nam (Tainan)', 'Tân Trúc (Hsinchu)'],
    ['Quần đảo Bành Hồ (Penghu)', 'Đảo Lan Tự (Orchid)', 'Đảo Lục Đảo (Green)', 'Đảo Kim Môn (Kinmen)', 'Quần đảo Mã Tổ']
  ),
  createCountryDef('hongkong', 'Hồng Kông', '🇭🇰', 'HK', 'asia', 'HONG KONG FLAG LIVE — 香港', '#EC1B2E', '#FFFFFF',
    ['Central & Western', 'Kowloon (Cửu Long)', 'Wan Chai', 'Tsim Sha Tsui', 'Mong Kok', 'Shatin'],
    ['Đảo Hồng Kông', 'Đảo Đại Nhĩ Sơn (Lantau)', 'Đảo Lamma', 'Đảo Trường Châu (Cheung Chau)']
  ),
  createCountryDef('macau', 'Ma Cao', '🇲🇴', 'MO', 'asia', 'MACAU FLAG LIVE — 澳門', '#007A5E', '#FFDF00',
    ['Macau Peninsula', 'Cotai Strip', 'Taipa Village', 'Coloane'],
    ['Đảo Taipa', 'Đảo Coloane']
  ),
  createCountryDef('mongolia', 'Mông Cổ', '🇲🇳', 'MN', 'asia', 'MONGOLIA FLAG LIVE — МОНГОЛ УЛС', '#DA2032', '#0066B3',
    ['Ulaanbaatar', 'Erdenet', 'Darkhan', 'Khovd', 'Moron', 'Altai'], []
  ),
  createCountryDef('north_korea', 'Triều Tiên', '🇰🇵', 'KP', 'asia', 'NORTH KOREA FLAG LIVE — 조선민주주의인민공화국', '#ED1B2D', '#024FA2',
    ['Bình Nhưỡng (Pyongyang)', 'Hamhung', 'Chongjin', 'Nampo', 'Wonsan', 'Kaesong'],
    ['Đảo Sinmi', 'Đảo Cho']
  ),
  createCountryDef('saudi_arabia', 'Ả Rập Xê Út', '🇸🇦', 'SA', 'asia', 'SAUDI ARABIA FLAG LIVE — المملكة العربية السعودية', '#006C35', '#FFFFFF',
    ['Riyadh', 'Jeddah', 'Mecca (Makkah)', 'Medina (Madinah)', 'Dammam', 'Khobar'],
    ['Quần đảo Farasan', 'Đảo Tarout', 'Đảo Tiran']
  ),
  createCountryDef('uae', 'UAE (Các Tiểu Vương Quốc Ả Rập)', '🇦🇪', 'AE', 'asia', 'UAE FLAG LIVE — EMIRATES', '#00732F', '#FF0000',
    ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
    ['Quần đảo Cây Cọ (Palm Jumeirah)', 'Quần đảo Thế Giới (The World)', 'Đảo Yas', 'Đảo Saadiyat']
  ),
  createCountryDef('qatar', 'Qatar', '🇶🇦', 'QA', 'asia', 'QATAR FLAG LIVE — دَوْلَةُ قَطَر', '#8A1538', '#FFFFFF',
    ['Doha', 'Al Wakrah', 'Al Rayyan', 'Al Khor', 'Lusail'],
    ['Đảo The Pearl-Qatar', 'Đảo Banana', 'Đảo Halul']
  ),
  createCountryDef('israel', 'Israel', '🇮🇱', 'IL', 'asia', 'ISRAEL FLAG LIVE — יִשְׂרָאֵל', '#0038B8', '#FFFFFF',
    ['Jerusalem', 'Tel Aviv', 'Haifa', 'Rishon LeZion', 'Eilat', 'Beersheba'], []
  ),
  createCountryDef('turkey', 'Thổ Nhĩ Kỳ', '🇹🇷', 'TR', 'asia', 'TÜRKİYE FLAG LIVE — TÜRKİYE CUMHURİYETİ', '#E30A17', '#FFFFFF',
    ['Ankara', 'Istanbul', 'Izmir', 'Antalya', 'Bursa', 'Adana', 'Trabzon'],
    ['Đảo Gökçeada', 'Đảo Bozcaada', 'Quần đảo Hoàng Tử (Princes’ Islands)']
  ),
  createCountryDef('kazakhstan', 'Kazakhstan', '🇰🇿', 'KZ', 'asia', 'KAZAKHSTAN FLAG LIVE — ҚАЗАҚСТАН', '#00AFCA', '#FEC50C',
    ['Astana (Nur-Sultan)', 'Almaty', 'Shymkent', 'Karaganda', 'Aktobe', 'Atyrau'], []
  ),
  createCountryDef('uzbekistan', 'Uzbekistan', '🇺🇿', 'UZ', 'asia', 'UZBEKISTAN FLAG LIVE — OʻZBEKISTON', '#1EB53A', '#0099B5',
    ['Tashkent', 'Samarkand', 'Bukhara', 'Khiva', 'Namangan', 'Andijan'], []
  ),
  createCountryDef('pakistan', 'Pakistan', '🇵🇰', 'PK', 'asia', 'PAKISTAN FLAG LIVE — پاکِستان', '#01411C', '#FFFFFF',
    ['Islamabad', 'Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi', 'Peshawar'],
    ['Đảo Astola', 'Đảo Manora', 'Đảo Buddo']
  ),
  createCountryDef('bangladesh', 'Bangladesh', '🇧🇩', 'BD', 'asia', 'BANGLADESH FLAG LIVE — বাংলাদেশ', '#006A4E', '#F42A41',
    ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Cox’s Bazar'],
    ['Đảo Saint Martin', 'Đảo Bhola', 'Đảo Sandwip', 'Đảo Hatiya']
  ),
  createCountryDef('sri_lanka', 'Sri Lanka', '🇱🇰', 'LK', 'asia', 'SRI LANKA FLAG LIVE — ශ්‍රී ලංකා', '#FFBE29', '#8D153A',
    ['Colombo', 'Sri Jayawardenepura Kotte', 'Kandy', 'Galle', 'Jaffna', 'Negombo'],
    ['Đảo Mannar', 'Đảo Delft', 'Đảo Pigeon']
  ),
  createCountryDef('nepal', 'Nepal', '🇳🇵', 'NP', 'asia', 'NEPAL FLAG LIVE — HIMALAYA & EVEREST', '#DC143C', '#003893',
    ['Kathmandu', 'Pokhara', 'Lalitpur', 'Bharatpur', 'Biratnagar', 'Dharan'], []
  ),
  createCountryDef('bhutan', 'Bhutan', '🇧🇹', 'BT', 'asia', 'BHUTAN FLAG LIVE — DRUK YUL', '#FFCC00', '#FF4E12',
    ['Thimphu', 'Paro', 'Punakha', 'Phuntsholing', 'Jakar', 'Wangdue'], []
  ),
  createCountryDef('maldives', 'Maldives', '🇲🇻', 'MV', 'asia', 'MALDIVES FLAG LIVE — DIVEHI RAAJJE', '#D21034', '#007E3A',
    ['Malé', 'Hulhumalé', 'Addu City', 'Fuvahmulah', 'Kulhudhuffushi'],
    ['Quần đảo san hô Kaafu', 'Quần đảo Ari Atoll', 'Quần đảo Baa Atoll', 'Quần đảo Dhaalu']
  ),
  createCountryDef('brunei', 'Brunei', '🇧🇳', 'BN', 'asia', 'BRUNEI FLAG LIVE — NEGARA BRUNEI DARUSSALAM', '#F7E017', '#000000',
    ['Bandar Seri Begawan', 'Kuala Belait', 'Seria', 'Tutong', 'Bangar'],
    ['Đảo Muara Besar', 'Đảo Berambang']
  ),
  createCountryDef('timor_leste', 'Đông Timor', '🇹🇱', 'TL', 'asia', 'TIMOR-LESTE FLAG LIVE', '#DA121A', '#FFC726',
    ['Dili', 'Baucau', 'Maliana', 'Suai', 'Liquiçá'],
    ['Đảo Atauro', 'Đảo Jaco']
  ),

  // ==================== CHÂU ÂU (EUROPE) ====================
  createCountryDef('france', 'Pháp', '🇫🇷', 'FR', 'europe', 'FRANCE FLAG LIVE — LA FRANCE', '#0055A4', '#EF4135',
    ['Thủ đô Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Bordeaux', 'Lille'],
    ['Đảo Corse (Corsica)', 'Quần đảo Hyères', 'Đảo Ré', 'Đảo Oléron']
  ),
  createCountryDef('germany', 'Đức', '🇩🇪', 'DE', 'europe', 'GERMANY FLAG LIVE — DEUTSCHLAND', '#FFCC00', '#DD0000',
    ['Berlin', 'Munich (Bayern)', 'Frankfurt', 'Hamburg', 'Cologne (Köln)', 'Stuttgart', 'Düsseldorf', 'Dresden'],
    ['Đảo Rügen', 'Đảo Sylt', 'Đảo Usedom', 'Đảo Fehmarn', 'Quần đảo Heligoland']
  ),
  createCountryDef('uk', 'Vương Quốc Anh', '🇬🇧', 'GB', 'europe', 'UNITED KINGDOM FLAG LIVE — GREAT BRITAIN', '#012169', '#C8102E',
    ['London (Anh)', 'Edinburgh (Scotland)', 'Cardiff (Wales)', 'Belfast (Bắc Ireland)', 'Manchester', 'Liverpool', 'Birmingham'],
    ['Đảo Wight', 'Quần đảo Hebrides', 'Quần đảo Orkney', 'Quần đảo Shetland', 'Đảo Anglesey', 'Đảo Man']
  ),
  createCountryDef('italy', 'Ý (Italia)', '🇮🇹', 'IT', 'europe', 'ITALY FLAG LIVE — REPUBBLICA ITALIANA', '#009246', '#CE2B37',
    ['Rome (Roma)', 'Milan (Milano)', 'Venice (Venezia)', 'Florence (Firenze)', 'Naples (Napoli)', 'Turin (Torino)', 'Bologna'],
    ['Đảo Sicilia (Sicily)', 'Đảo Sardegna (Sardinia)', 'Đảo Capri', 'Đảo Elba', 'Đảo Ischia', 'Quần đảo Aeolian']
  ),
  createCountryDef('spain', 'Tây Ban Nha', '🇪🇸', 'ES', 'europe', 'SPAIN FLAG LIVE — ESPAÑA', '#AA151B', '#F1BF00',
    ['Madrid', 'Barcelona (Catalonia)', 'Valencia', 'Seville (Andalusia)', 'Zaragoza', 'Malaga', 'Bilbao'],
    ['Quần đảo Baleares (Mallorca, Ibiza, Menorca)', 'Quần đảo Canaria (Tenerife, Gran Canaria, Lanzarote)']
  ),
  createCountryDef('portugal', 'Bồ Đào Nha', '🇵🇹', 'PT', 'europe', 'PORTUGAL FLAG LIVE — PORTUGAL', '#006600', '#FF0000',
    ['Lisbon (Lisboa)', 'Porto', 'Coimbra', 'Braga', 'Faro (Algarve)', 'Funchal'],
    ['Quần đảo Madeira', 'Quần đảo Açores (Azores - 9 đảo)']
  ),
  createCountryDef('russia', 'Nga', '🇷🇺', 'RU', 'europe', 'RUSSIA FLAG LIVE — РОССИЯ', '#0039A6', '#D52B1E',
    ['Moscow (Москва)', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Vladivostok', 'Sochi'],
    ['Đảo Sakhalin', 'Quần đảo Kuril', 'Quần đảo Novaya Zemlya', 'Đảo Wrangel']
  ),
  createCountryDef('netherlands', 'Hà Lan', '🇳🇱', 'NL', 'europe', 'NETHERLANDS FLAG LIVE — NEDERLAND', '#AE1C28', '#21468B',
    ['Amsterdam', 'Rotterdam', 'The Hague (La Haye)', 'Utrecht', 'Eindhoven', 'Groningen'],
    ['Đảo Texel', 'Đảo Terschelling', 'Đảo Ameland', 'Đảo Schiermonnikoog']
  ),
  createCountryDef('belgium', 'Bỉ', '🇧🇪', 'BE', 'europe', 'BELGIUM FLAG LIVE — BELGIË', '#ED2939', '#FAE042',
    ['Brussels', 'Antwerp (Antwerpen)', 'Ghent (Gent)', 'Bruges (Brugge)', 'Liège', 'Namur'], []
  ),
  createCountryDef('switzerland', 'Thụy Sĩ', '🇨🇭', 'CH', 'europe', 'SWITZERLAND FLAG LIVE — SCHWEIZ', '#FF0000', '#FFFFFF',
    ['Bern', 'Zurich', 'Geneva (Genève)', 'Basel', 'Lausanne', 'Lucerne', 'Lugano'], []
  ),
  createCountryDef('austria', 'Áo', '🇦🇹', 'AT', 'europe', 'AUSTRIA FLAG LIVE — ÖSTERREICH', '#ED2939', '#FFFFFF',
    ['Vienna (Wien)', 'Salzburg', 'Innsbruck', 'Graz', 'Linz', 'Klagenfurt'], []
  ),
  createCountryDef('sweden', 'Thụy Điển', '🇸🇪', 'SE', 'europe', 'SWEDEN FLAG LIVE — SVERIGE', '#006AA7', '#FECC00',
    ['Stockholm', 'Gothenburg (Göteborg)', 'Malmö', 'Uppsala', 'Västerås', 'Örebro'],
    ['Đảo Gotland', 'Đảo Öland', 'Quần đảo Stockholm (30.000 đảo)']
  ),
  createCountryDef('norway', 'Na Uy', '🇳🇴', 'NO', 'europe', 'NORWAY FLAG LIVE — NORGE', '#BA0C2F', '#00205B',
    ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Tromsø', 'Drammen'],
    ['Quần đảo Lofoten', 'Quần đảo Svalbard', 'Đảo Senja', 'Quần đảo Vesterålen']
  ),
  createCountryDef('denmark', 'Đan Mạch', '🇩🇰', 'DK', 'europe', 'DENMARK FLAG LIVE — DANMARK', '#C60C30', '#FFFFFF',
    ['Copenhagen (København)', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg'],
    ['Đảo Zealand (Sjælland)', 'Đảo Funen (Fyn)', 'Đảo Bornholm', 'Quần đảo Faroe', 'Đảo Greenland']
  ),
  createCountryDef('finland', 'Phần Lan', '🇫🇮', 'FI', 'europe', 'FINLAND FLAG LIVE — SUOMI', '#003580', '#FFFFFF',
    ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Rovaniemi (Lapland)'],
    ['Quần đảo Åland (6.500 đảo)', 'Quần đảo Turku', 'Đảo Hailuoto']
  ),
  createCountryDef('poland', 'Ba Lan', '🇵🇱', 'PL', 'europe', 'POLAND FLAG LIVE — POLSKA', '#DC143C', '#FFFFFF',
    ['Warsaw (Warszawa)', 'Kraków', 'Wrocław', 'Gdańsk', 'Poznań', 'Łódź'],
    ['Đảo Wolin', 'Đảo Usedom (phía đông)']
  ),
  createCountryDef('czechia', 'Cộng Hòa Séc', '🇨🇿', 'CZ', 'europe', 'CZECHIA FLAG LIVE — ČESKÁ REPUBLIKA', '#11457E', '#D7141A',
    ['Prague (Praha)', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc'], []
  ),
  createCountryDef('greece', 'Hy Lạp', '🇬🇷', 'GR', 'europe', 'GREECE FLAG LIVE — ΕΛΛΑΔΑ', '#0D5EAF', '#FFFFFF',
    ['Athens (Athina)', 'Thessaloniki', 'Patras', 'Heraklion', 'Larissa', 'Volos'],
    ['Đảo Crete (Kriti)', 'Đảo Santorini', 'Đảo Mykonos', 'Đảo Rhodes', 'Đảo Corfu (Kerkyra)', 'Đảo Zakynthos']
  ),
  createCountryDef('ireland', 'Ireland (Ai-len)', '🇮🇪', 'IE', 'europe', 'IRELAND FLAG LIVE — ÉIRE', '#169B62', '#FF883E',
    ['Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Kilkenny'],
    ['Quần đảo Aran', 'Đảo Achill', 'Đảo Valentia']
  ),
  createCountryDef('hungary', 'Hungary', '🇭🇺', 'HU', 'europe', 'HUNGARY FLAG LIVE — MAGYARORSZÁG', '#CE2939', '#477050',
    ['Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs', 'Győr'], []
  ),
  createCountryDef('romania', 'Romania', '🇷🇴', 'RO', 'europe', 'ROMANIA FLAG LIVE — ROMÂNIA', '#002B7F', '#CE1126',
    ['Bucharest (București)', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Constanța', 'Brașov'],
    ['Đảo Sacalin', 'Đảo Insula Șerpilor']
  ),
  createCountryDef('ukraine', 'Ukraine', '🇺🇦', 'UA', 'europe', 'UKRAINE FLAG LIVE — УКРАЇНА', '#0057B7', '#FFD700',
    ['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Lviv', 'Zaporizhzhia'],
    ['Đảo Dzharylhach', 'Đảo Khortytsia']
  ),
  createCountryDef('croatia', 'Croatia', '🇭🇷', 'HR', 'europe', 'CROATIA FLAG LIVE — HRVATSKA', '#FF0000', '#0000FF',
    ['Zagreb', 'Split', 'Dubrovnik', 'Rijeka', 'Osijek', 'Zadar'],
    ['Đảo Krk', 'Đảo Cres', 'Đảo Brač', 'Đảo Hvar', 'Đảo Korčula', 'Đảo Vis']
  ),
  createCountryDef('bulgaria', 'Bulgaria', '🇧🇬', 'BG', 'europe', 'BULGARIA FLAG LIVE — БЪЛГАРИЯ', '#00966E', '#D62612',
    ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Stara Zagora'],
    ['Đảo St. Anastasia', 'Đảo St. Ivan']
  ),
  createCountryDef('slovakia', 'Slovakia', '🇸🇰', 'SK', 'europe', 'SLOVAKIA FLAG LIVE — SLOVENSKO', '#0B4EA2', '#EE1C25',
    ['Bratislava', 'Košice', 'Prešov', 'Žilina', 'Banská Bystrica'], []
  ),
  createCountryDef('iceland', 'Iceland', '🇮🇸', 'IS', 'europe', 'ICELAND FLAG LIVE — ÍSLAND', '#02529C', '#DC1E35',
    ['Reykjavík', 'Kópavogur', 'Hafnarfjörður', 'Akureyri', 'Keflavík'],
    ['Đảo Heimaey (Vestmannaeyjar)', 'Đảo Grímsey', 'Đảo Surtsey']
  ),
  createCountryDef('luxembourg', 'Luxembourg', '🇱🇺', 'LU', 'europe', 'LUXEMBOURG FLAG LIVE', '#EA141D', '#00A1DE',
    ['Luxembourg City', 'Esch-sur-Alzette', 'Differdange', 'Dudelange'], []
  ),
  createCountryDef('monaco', 'Monaco', '🇲🇨', 'MC', 'europe', 'MONACO FLAG LIVE — PRINCIPAUTÉ DE MONACO', '#CE1126', '#FFFFFF',
    ['Monaco-Ville', 'Monte Carlo', 'La Condamine', 'Fontvieille'], []
  ),
  createCountryDef('vatican', 'Vatican', '🇻🇦', 'VA', 'europe', 'VATICAN FLAG LIVE — STATO DELLA CITTÀ DEL VATICANO', '#FFE000', '#FFFFFF',
    ['Quảng trường Thánh Phêrô', 'Vương cung Thánh đường', 'Bảo tàng Vatican', 'Vườn Vatican'], []
  ),

  // ==================== CHÂU MỸ (AMERICAS) ====================
  createCountryDef('usa', 'Hoa Kỳ (Mỹ)', '🇺🇸', 'US', 'americas', 'USA FLAG LIVE — UNITED STATES OF AMERICA', '#B22234', '#3C3B6E',
    ['Washington D.C', 'New York City', 'Los Angeles (California)', 'Chicago', 'Houston (Texas)', 'Miami (Florida)', 'San Francisco', 'Seattle'],
    ['Quần đảo Hawaii (Oahu, Maui, Kauai)', 'Đảo Puerto Rico', 'Đảo Guam', 'Quần đảo Virgin (Mỹ)', 'Đảo Key West']
  ),
  createCountryDef('canada', 'Canada', '🇨🇦', 'CA', 'americas', 'CANADA FLAG LIVE — TRUE NORTH', '#FF0000', '#FFFFFF',
    ['Ottawa', 'Toronto (Ontario)', 'Vancouver (British Columbia)', 'Montreal (Quebec)', 'Calgary', 'Edmonton', 'Quebec City'],
    ['Đảo Vancouver', 'Đảo Prince Edward', 'Đảo Newfoundland', 'Đảo Baffin', 'Đảo Victoria']
  ),
  createCountryDef('brazil', 'Brazil', '🇧🇷', 'BR', 'americas', 'BRAZIL FLAG LIVE — BRASIL', '#009739', '#FEDD00',
    ['Brasília', 'São Paulo', 'Rio de Janeiro', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus (Amazon)'],
    ['Quần đảo Fernando de Noronha', 'Đảo Marajó', 'Đảo Ilhabela', 'Đảo Santa Catarina (Florianópolis)']
  ),
  createCountryDef('mexico', 'Mexico', '🇲🇽', 'MX', 'americas', 'MEXICO FLAG LIVE — MÉXICO', '#006847', '#CE1126',
    ['Mexico City (CDMX)', 'Guadalajara', 'Monterrey', 'Cancún', 'Puebla', 'Tijuana', 'Mérida'],
    ['Đảo Cozumel', 'Đảo Isla Mujeres', 'Đảo Holbox', 'Quần đảo Revillagigedo']
  ),
  createCountryDef('argentina', 'Argentina', '🇦🇷', 'AR', 'americas', 'ARGENTINA FLAG LIVE — REPÚBLICA ARGENTINA', '#75AADB', '#F4B459',
    ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'Mar del Plata', 'Ushuaia (Tierra del Fuego)', 'Salta'],
    ['Quần đảo Tierra del Fuego (Đất Lửa)', 'Quần đảo Malvinas (Falkland)', 'Đảo de los Estados']
  ),
  createCountryDef('chile', 'Chile', '🇨🇱', 'CL', 'americas', 'CHILE FLAG LIVE — REPÚBLICA DE CHILE', '#0039A6', '#D52B1E',
    ['Santiago', 'Valparaíso', 'Concepción', 'Antofagasta', 'Viña del Mar', 'Punta Arenas'],
    ['Đảo Phục Sinh (Rapa Nui - Easter Island)', 'Đảo Chiloé', 'Quần đảo Juan Fernández']
  ),
  createCountryDef('colombia', 'Colombia', '🇨🇴', 'CO', 'americas', 'COLOMBIA FLAG LIVE — REPÚBLICA DE COLOMBIA', '#FCD116', '#003893',
    ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga'],
    ['Quần đảo San Andrés & Providencia', 'Đảo Gorgona', 'Đảo Malpelo']
  ),
  createCountryDef('peru', 'Peru', '🇵🇪', 'PE', 'americas', 'PERU FLAG LIVE — REPÚBLICA DEL PERÚ', '#D91023', '#FFFFFF',
    ['Lima', 'Cusco (Machu Picchu)', 'Arequipa', 'Trujillo', 'Chiclayo', 'Iquitos (Amazon)'],
    ['Quần đảo Ballestas', 'Đảo Taquile (Hồ Titicaca)', 'Đảo Amantaní']
  ),
  createCountryDef('cuba', 'Cuba', '🇨🇺', 'CU', 'americas', 'CUBA FLAG LIVE — REPÚBLICA DE CUBA', '#002590', '#CB1515',
    ['La Habana (Havana)', 'Santiago de Cuba', 'Varadero', 'Camagüey', 'Holguín', 'Santa Clara'],
    ['Đảo Isla de la Juventud', 'Quần đảo Cayo Coco', 'Đảo Cayo Largo del Sur', 'Đảo Cayo Guillermo']
  ),
  createCountryDef('jamaica', 'Jamaica', '🇯🇲', 'JM', 'americas', 'JAMAICA FLAG LIVE', '#009B3A', '#FED100',
    ['Kingston', 'Montego Bay', 'Ocho Rios', 'Negril', 'Port Antonio'],
    ['Quần đảo Pedro Cays', 'Quần đảo Morant Cays']
  ),
  createCountryDef('uruguay', 'Uruguay', '🇺🇾', 'UY', 'americas', 'URUGUAY FLAG LIVE', '#0038A8', '#FCD116',
    ['Montevideo', 'Punta del Este', 'Salto', 'Paysandú', 'Colonia del Sacramento'],
    ['Đảo Gorriti', 'Đảo de Flores']
  ),
  createCountryDef('panama', 'Panama', '🇵🇦', 'PA', 'americas', 'PANAMA FLAG LIVE — CANAL DE PANAMÁ', '#005293', '#D21034',
    ['Panama City', 'Colón', 'David', 'Bocas del Toro', 'Santiago'],
    ['Quần đảo San Blas (365 đảo)', 'Quần đảo Bocas del Toro', 'Quần đảo Ngọc Trai (Pearl Islands)']
  ),
  createCountryDef('costa_rica', 'Costa Rica', '🇨🇷', 'CR', 'americas', 'COSTA RICA FLAG LIVE — PURA VIDA', '#002B7F', '#CE1126',
    ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Liberia', 'Puntarenas'],
    ['Đảo Cocos (Isla del Coco)', 'Đảo Tortuga', 'Đảo Chira']
  ),
  createCountryDef('ecuador', 'Ecuador', '🇪🇨', 'EC', 'americas', 'ECUADOR FLAG LIVE', '#FFD100', '#0072CE',
    ['Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo', 'Machala', 'Manta'],
    ['Quần đảo Galápagos (19 đảo)', 'Đảo Puná', 'Đảo Santay']
  ),
  createCountryDef('venezuela', 'Venezuela', '🇻🇪', 'VE', 'americas', 'VENEZUELA FLAG LIVE', '#FFCC00', '#00247D',
    ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Ciudad Guayana'],
    ['Đảo Margarita', 'Quần đảo Los Roques', 'Đảo Coche', 'Đảo Cubagua']
  ),

  // ==================== CHÂU ĐẠI DƯƠNG (OCEANIA) ====================
  createCountryDef('australia', 'Úc (Australia)', '🇦🇺', 'AU', 'oceania', 'AUSTRALIA FLAG LIVE — DOWN UNDER', '#00008B', '#FF0000',
    ['Canberra', 'Sydney (New South Wales)', 'Melbourne (Victoria)', 'Brisbane (Queensland)', 'Perth', 'Adelaide', 'Gold Coast'],
    ['Đảo Tasmania', 'Quần đảo Rạn San Hô Lớn (Great Barrier Reef)', 'Đảo Kangaroo', 'Đảo Fraser (K’gari)', 'Đảo Lord Howe']
  ),
  createCountryDef('new_zealand', 'New Zealand', '🇳🇿', 'NZ', 'oceania', 'NEW ZEALAND FLAG LIVE — AOTEAROA', '#00247D', '#CC142B',
    ['Wellington', 'Auckland', 'Christchurch', 'Queenstown', 'Hamilton', 'Tauranga', 'Dunedin'],
    ['Đảo Bắc (North Island)', 'Đảo Nam (South Island)', 'Đảo Stewart (Rakiura)', 'Quần đảo Chatham']
  ),
  createCountryDef('fiji', 'Fiji', '🇫🇯', 'FJ', 'oceania', 'FIJI FLAG LIVE — BULA FIJI', '#68BFE5', '#CE1126',
    ['Suva', 'Nadi', 'Lautoka', 'Labasa', 'Savusavu'],
    ['Đảo Viti Levu', 'Đảo Vanua Levu', 'Quần đảo Mamanuca', 'Quần đảo Yasawa', 'Đảo Taveuni']
  ),
  createCountryDef('papua_new_guinea', 'Papua New Guinea', '🇵🇬', 'PG', 'oceania', 'PAPUA NEW GUINEA FLAG LIVE', '#CE1126', '#000000',
    ['Port Moresby', 'Lae', 'Mount Hagen', 'Madang', 'Goroka', 'Kokopo'],
    ['Đảo New Britain', 'Đảo New Ireland', 'Đảo Bougainville', 'Đảo Manus']
  ),
  createCountryDef('samoa', 'Samoa', '🇼🇸', 'WS', 'oceania', 'SAMOA FLAG LIVE', '#CE1126', '#002B7F',
    ['Apia', 'Vaitele', 'Faleasiu', 'Siusega'],
    ['Đảo Upolu', 'Đảo Savai’i', 'Đảo Manono', 'Đảo Apolima']
  ),

  // ==================== CHÂU PHI (AFRICA) ====================
  createCountryDef('egypt', 'Ai Cập (Egypt)', '🇪🇬', 'EG', 'africa', 'EGYPT FLAG LIVE — KINH ĐÔ KIM TỰ THÁP', '#C09300', '#CE1126',
    ['Cairo (Al Qāhirah)', 'Alexandria', 'Giza (Kim Tự Tháp)', 'Luxor (Đền Karnak)', 'Aswan', 'Sharm El Sheikh', 'Hurghada'],
    ['Đảo Pharaon', 'Đảo Elephantine', 'Đảo Tiran', 'Đảo Giftun']
  ),
  createCountryDef('south_africa', 'Nam Phi', '🇿🇦', 'ZA', 'africa', 'SOUTH AFRICA FLAG LIVE — RAINBOW NATION', '#007A3D', '#FFB612',
    ['Pretoria', 'Cape Town', 'Johannesburg', 'Durban', 'Bloemfontein', 'Port Elizabeth'],
    ['Đảo Robben', 'Đảo Marion', 'Đảo Dassen', 'Đảo Seal']
  ),
  createCountryDef('morocco', 'Morocco (Ma-rốc)', '🇲🇦', 'MA', 'africa', 'MOROCCO FLAG LIVE — AL-MAGHRIB', '#C1272D', '#006233',
    ['Rabat', 'Casablanca', 'Marrakech', 'Fes', 'Tangier', 'Agadir', 'Chefchaouen'],
    ['Quần đảo Purpuraires', 'Đảo Mogador']
  ),
  createCountryDef('nigeria', 'Nigeria', '🇳🇬', 'NG', 'africa', 'NIGERIA FLAG LIVE — GIANT OF AFRICA', '#008751', '#FFFFFF',
    ['Abuja', 'Lagos', 'Kano', 'Ibadan', 'Port Harcourt', 'Benin City'],
    ['Đảo Lagos', 'Đảo Victoria', 'Đảo Banana', 'Đảo Bonny']
  ),
  createCountryDef('kenya', 'Kenya', '🇰🇪', 'KE', 'africa', 'KENYA FLAG LIVE — SAFARI PARADISE', '#990000', '#006600',
    ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Malindi'],
    ['Đảo Lamu', 'Đảo Wasini', 'Đảo Manda', 'Đảo Pate']
  ),
  createCountryDef('madagascar', 'Madagascar', '🇲🇬', 'MG', 'africa', 'MADAGASCAR FLAG LIVE', '#FC3D32', '#007E3A',
    ['Antananarivo', 'Toamasina', 'Antsirabe', 'Mahajanga', 'Fianarantsoa'],
    ['Đảo Nosy Be', 'Đảo Sainte Marie', 'Đảo Nosy Komba', 'Đảo Nosy Iranja']
  ),
  createCountryDef('algeria', 'Algeria', '🇩🇿', 'DZ', 'africa', 'ALGERIA FLAG LIVE', '#006633', '#D21034',
    ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna'], []
  ),
  createCountryDef('ethiopia', 'Ethiopia', '🇪🇹', 'ET', 'africa', 'ETHIOPIA FLAG LIVE', '#009A44', '#FED100',
    ['Addis Ababa', 'Dire Dawa', 'Mekelle', 'Gondar', 'Bahir Dar', 'Hawassa'], []
  ),
  createCountryDef('ghana', 'Ghana', '🇬🇭', 'GH', 'africa', 'GHANA FLAG LIVE — BLACK STARS', '#EF3340', '#FFD100',
    ['Accra', 'Kumasi', 'Tamale', 'Sekondi-Takoradi', 'Cape Coast'], []
  ),
  createCountryDef('ivory_coast', 'Bờ Biển Ngà', '🇨🇮', 'CI', 'africa', 'IVORY COAST FLAG LIVE — CÔTE D’IVOIRE', '#FF8200', '#009A44',
    ['Yamoussoukro', 'Abidjan', 'Bouaké', 'Daloa', 'San-Pédro', 'Korhogo'], []
  ),
  createCountryDef('cameroon', 'Cameroon', '🇨🇲', 'CM', 'africa', 'CAMEROON FLAG LIVE', '#007A5E', '#CE1126',
    ['Yaoundé', 'Douala', 'Garoua', 'Bamenda', 'Bafoussam'], []
  ),
  createCountryDef('senegal', 'Senegal', '🇸🇳', 'SN', 'africa', 'SENEGAL FLAG LIVE — LIONS OF TERANGA', '#00853F', '#FDEF42',
    ['Dakar', 'Touba', 'Thiès', 'Rufisque', 'Saint-Louis', 'Ziguinchor'],
    ['Đảo Gorée', 'Đảo Ngor', 'Đảo Madeleine']
  ),
  createCountryDef('tunisia', 'Tunisia', '🇹🇳', 'TN', 'africa', 'TUNISIA FLAG LIVE', '#E70013', '#FFFFFF',
    ['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès'],
    ['Đảo Djerba', 'Quần đảo Kerkennah', 'Quần đảo Galite']
  ),
  createCountryDef('tanzania', 'Tanzania', '🇹🇿', 'TZ', 'africa', 'TANZANIA FLAG LIVE — KILIMANJARO', '#1EB53A', '#00A3DD',
    ['Dodoma', 'Dar es Salaam', 'Mwanza', 'Arusha', 'Zanzibar City', 'Mbeya'],
    ['Đảo Zanzibar (Unguja)', 'Đảo Pemba', 'Đảo Mafia', 'Đảo Chumbe']
  ),
  createCountryDef('uganda', 'Uganda', '🇺🇬', 'UG', 'africa', 'UGANDA FLAG LIVE — PEARL OF AFRICA', '#FCDC04', '#D90000',
    ['Kampala', 'Nansana', 'Kira', 'Mbarara', 'Mukono', 'Jinja'],
    ['Quần đảo Ssese (84 đảo trên hồ Victoria)', 'Đảo Bugala']
  )
];

// Map lookup theo ID
export const COUNTRIES_BY_ID = WORLD_COUNTRIES.reduce((acc, c) => {
  acc[c.id] = c;
  return acc;
}, {});

export default WORLD_COUNTRIES;
