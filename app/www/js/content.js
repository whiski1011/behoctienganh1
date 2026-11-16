/* Nội dung bài học – Bé Học Tiếng Anh 1
 * Khung trình độ tham khảo: Cambridge Young Learners (Pre-A1 Starters → A1 Movers → A2 Flyers)
 * và các chủ đề quen thuộc của chương trình Tiếng Anh lớp 1–3 tại Việt Nam.
 * Mỗi từ: [tiếng Anh, nghĩa tiếng Việt, hình]  — hình: emoji, "c:#hex" (ô màu), "t:chữ" (chữ lớn)
 * Mỗi câu: [tiếng Anh, nghĩa tiếng Việt, hình]
 */
window.CONTENT = {
  levels: [
    { id: 1, name: "Làm quen", en: "Starter", icon: "🌱", desc: "Từ vựng đầu tiên, chào hỏi, màu sắc, con số" },
    { id: 2, name: "Trung bình", en: "Mover", icon: "🌼", desc: "Mở rộng từ vựng, câu ngắn hằng ngày" },
    { id: 3, name: "Nâng cao", en: "Flyer", icon: "🚀", desc: "Câu dài hơn, hội thoại, đọc truyện" }
  ],
  units: [
    // ================= CẤP 1: LÀM QUEN =================
    { id: "abc", level: 1, title: "Bảng chữ cái", en: "The Alphabet", icon: "🔤", type: "abc" },
    {
      id: "hello", level: 1, title: "Xin chào!", en: "Hello!", icon: "👋",
      words: [
        ["hello", "xin chào", "👋"], ["boy", "bạn trai", "👦"], ["girl", "bạn gái", "👧"],
        ["teacher", "cô giáo", "👩‍🏫"], ["friend", "bạn bè", "👫"], ["yes", "vâng, có", "✅"],
        ["no", "không", "❌"], ["thank you", "cảm ơn", "🙏"]
      ],
      sentences: [
        ["Hello!", "Xin chào!", "👋"],
        ["I am a boy.", "Tớ là con trai.", "👦"],
        ["I am a girl.", "Tớ là con gái.", "👧"],
        ["Goodbye, teacher!", "Chào tạm biệt cô ạ!", "👩‍🏫"],
        ["Thank you!", "Cảm ơn bạn!", "🙏"]
      ]
    },
    {
      id: "colors", level: 1, title: "Màu sắc", en: "Colours", icon: "🎨",
      words: [
        ["red", "màu đỏ", "c:#e53935"], ["blue", "màu xanh dương", "c:#1e88e5"], ["yellow", "màu vàng", "c:#fdd835"],
        ["green", "màu xanh lá", "c:#43a047"], ["orange", "màu cam", "c:#fb8c00"], ["purple", "màu tím", "c:#8e24aa"],
        ["pink", "màu hồng", "c:#f06292"], ["black", "màu đen", "c:#212121"], ["white", "màu trắng", "c:#ffffff"],
        ["brown", "màu nâu", "c:#6d4c41"]
      ],
      sentences: [
        ["It is red.", "Nó màu đỏ.", "🍎"],
        ["The sun is yellow.", "Mặt trời màu vàng.", "☀️"],
        ["The frog is green.", "Con ếch màu xanh lá.", "🐸"],
        ["The sky is blue.", "Bầu trời màu xanh dương.", "🌤️"]
      ]
    },
    {
      id: "num10", level: 1, title: "Số đếm 1–10", en: "Numbers 1–10", icon: "🔢",
      words: [
        ["one", "số một", "t:1"], ["two", "số hai", "t:2"], ["three", "số ba", "t:3"], ["four", "số bốn", "t:4"],
        ["five", "số năm", "t:5"], ["six", "số sáu", "t:6"], ["seven", "số bảy", "t:7"], ["eight", "số tám", "t:8"],
        ["nine", "số chín", "t:9"], ["ten", "số mười", "t:10"]
      ],
      sentences: [
        ["I am six.", "Tớ sáu tuổi.", "🎂"],
        ["Two cats.", "Hai con mèo.", "🐱🐱"],
        ["Three apples.", "Ba quả táo.", "🍎🍎🍎"],
        ["One, two, three, go!", "Một, hai, ba, đi nào!", "🏁"]
      ]
    },
    {
      id: "pets", level: 1, title: "Con vật nuôi", en: "Animals", icon: "🐶",
      words: [
        ["cat", "con mèo", "🐱"], ["dog", "con chó", "🐶"], ["bird", "con chim", "🐦"], ["fish", "con cá", "🐟"],
        ["duck", "con vịt", "🦆"], ["rabbit", "con thỏ", "🐰"], ["cow", "con bò", "🐮"], ["chicken", "con gà", "🐔"],
        ["pig", "con lợn", "🐷"], ["horse", "con ngựa", "🐴"]
      ],
      sentences: [
        ["It is a cat.", "Đó là một con mèo.", "🐱"],
        ["I have a dog.", "Tớ có một con chó.", "🐶"],
        ["The duck can swim.", "Con vịt biết bơi.", "🦆"],
        ["The bird can fly.", "Con chim biết bay.", "🐦"]
      ]
    },
    {
      id: "family", level: 1, title: "Gia đình", en: "My Family", icon: "👨‍👩‍👧",
      words: [
        ["mother", "mẹ", "👩"], ["father", "bố", "👨"], ["sister", "chị / em gái", "👧"], ["brother", "anh / em trai", "👦"],
        ["baby", "em bé", "👶"], ["grandmother", "bà", "👵"], ["grandfather", "ông", "👴"], ["family", "gia đình", "👨‍👩‍👧"]
      ],
      sentences: [
        ["This is my mother.", "Đây là mẹ của tớ.", "👩"],
        ["This is my father.", "Đây là bố của tớ.", "👨"],
        ["I love my family.", "Tớ yêu gia đình tớ.", "👨‍👩‍👧"],
        ["He is my brother.", "Bạn ấy là anh trai tớ.", "👦"]
      ]
    },
    {
      id: "body", level: 1, title: "Cơ thể", en: "My Body", icon: "🙂",
      words: [
        ["eye", "con mắt", "👁️"], ["ear", "cái tai", "👂"], ["nose", "cái mũi", "👃"], ["mouth", "cái miệng", "👄"],
        ["hand", "bàn tay", "✋"], ["foot", "bàn chân", "🦶"], ["leg", "cái chân", "🦵"], ["arm", "cánh tay", "💪"],
        ["tooth", "cái răng", "🦷"]
      ],
      sentences: [
        ["Touch your nose.", "Chạm vào mũi của con.", "👃"],
        ["Clap your hands.", "Vỗ tay nào.", "👏"],
        ["I have two eyes.", "Tớ có hai con mắt.", "👀"],
        ["Open your mouth.", "Há miệng ra nào.", "👄"]
      ]
    },
    {
      id: "fruits", level: 1, title: "Trái cây", en: "Fruit", icon: "🍎",
      words: [
        ["apple", "quả táo", "🍎"], ["banana", "quả chuối", "🍌"], ["orange", "quả cam", "🍊"], ["grapes", "chùm nho", "🍇"],
        ["mango", "quả xoài", "🥭"], ["watermelon", "quả dưa hấu", "🍉"], ["strawberry", "quả dâu tây", "🍓"],
        ["pineapple", "quả dứa", "🍍"], ["lemon", "quả chanh", "🍋"]
      ],
      sentences: [
        ["I like bananas.", "Tớ thích chuối.", "🍌"],
        ["It is an apple.", "Đó là một quả táo.", "🍎"],
        ["The mango is yummy.", "Quả xoài ngon quá.", "🥭"],
        ["Do you like grapes? Yes, I do.", "Bạn có thích nho không? Có, tớ thích.", "🍇"]
      ]
    },
    {
      id: "toys", level: 1, title: "Đồ chơi", en: "Toys", icon: "🧸",
      words: [
        ["ball", "quả bóng", "⚽"], ["teddy bear", "gấu bông", "🧸"], ["kite", "cái diều", "🪁"], ["car", "ô tô", "🚗"],
        ["robot", "rô-bốt", "🤖"], ["balloon", "bóng bay", "🎈"], ["train", "tàu hỏa", "🚂"], ["drum", "cái trống", "🥁"],
        ["puzzle", "đồ xếp hình", "🧩"]
      ],
      sentences: [
        ["I have a ball.", "Tớ có một quả bóng.", "⚽"],
        ["This is my teddy bear.", "Đây là gấu bông của tớ.", "🧸"],
        ["Let's fly a kite!", "Cùng thả diều nào!", "🪁"],
        ["My robot is big.", "Rô-bốt của tớ rất to.", "🤖"]
      ]
    },
    {
      id: "school", level: 1, title: "Đồ dùng học tập", en: "At School", icon: "🎒",
      words: [
        ["book", "quyển sách", "📖"], ["pen", "cái bút mực", "🖊️"], ["pencil", "bút chì", "✏️"], ["ruler", "thước kẻ", "📏"],
        ["bag", "cặp sách", "🎒"], ["crayon", "bút sáp màu", "🖍️"], ["scissors", "cái kéo", "✂️"], ["chair", "cái ghế", "🪑"],
        ["school", "trường học", "🏫"]
      ],
      sentences: [
        ["Open your book.", "Mở sách ra nào.", "📖"],
        ["This is my pencil.", "Đây là bút chì của tớ.", "✏️"],
        ["Sit down, please.", "Mời con ngồi xuống.", "🪑"],
        ["Stand up, please.", "Mời con đứng lên.", "🧍"]
      ]
    },
    {
      id: "shapes", level: 1, title: "Hình khối", en: "Shapes", icon: "🔺",
      words: [
        ["circle", "hình tròn", "⚪"], ["square", "hình vuông", "🟦"], ["triangle", "hình tam giác", "🔺"], ["star", "ngôi sao", "⭐"],
        ["heart", "trái tim", "❤️"], ["diamond", "hình thoi", "🔷"]
      ],
      sentences: [
        ["It is a star.", "Đó là một ngôi sao.", "⭐"],
        ["The ball is a circle.", "Quả bóng hình tròn.", "⚽"],
        ["I can draw a heart.", "Tớ biết vẽ trái tim.", "❤️"]
      ]
    },

    // ================= CẤP 2: TRUNG BÌNH =================
    {
      id: "food", level: 2, title: "Đồ ăn, thức uống", en: "Food & Drinks", icon: "🍚",
      words: [
        ["rice", "cơm", "🍚"], ["bread", "bánh mì", "🍞"], ["milk", "sữa", "🥛"], ["water", "nước", "💧"],
        ["egg", "quả trứng", "🥚"], ["cake", "bánh ngọt", "🍰"], ["ice cream", "kem", "🍦"], ["noodles", "mì, phở", "🍜"],
        ["chicken", "thịt gà", "🍗"], ["juice", "nước ép", "🧃"]
      ],
      sentences: [
        ["I am hungry.", "Tớ đói rồi.", "😋"],
        ["I want some milk.", "Tớ muốn uống sữa.", "🥛"],
        ["I like ice cream.", "Tớ thích ăn kem.", "🍦"],
        ["What do you want? I want bread, please.", "Bạn muốn gì? Cho tớ bánh mì nhé.", "🍞"],
        ["Can I have some water, please?", "Cho tớ xin ít nước nhé?", "💧"]
      ]
    },
    {
      id: "clothes", level: 2, title: "Quần áo", en: "Clothes", icon: "👕",
      words: [
        ["T-shirt", "áo phông", "👕"], ["dress", "váy liền", "👗"], ["cap", "mũ lưỡi trai", "🧢"], ["hat", "mũ", "👒"],
        ["shoes", "đôi giày", "👟"], ["socks", "đôi tất", "🧦"], ["jacket", "áo khoác", "🧥"], ["trousers", "quần dài", "👖"],
        ["glasses", "kính mắt", "👓"], ["shorts", "quần đùi", "🩳"]
      ],
      sentences: [
        ["I am wearing a T-shirt.", "Tớ đang mặc áo phông.", "👕"],
        ["Put on your shoes.", "Con đi giày vào nhé.", "👟"],
        ["Her dress is pink.", "Váy của bạn ấy màu hồng.", "👗"],
        ["It is cold. Wear your jacket.", "Trời lạnh. Mặc áo khoác vào nhé.", "🧥"]
      ]
    },
    {
      id: "house", level: 2, title: "Ngôi nhà", en: "My House", icon: "🏠",
      words: [
        ["house", "ngôi nhà", "🏠"], ["door", "cửa ra vào", "🚪"], ["bed", "cái giường", "🛏️"], ["sofa", "ghế sô-pha", "🛋️"],
        ["bath", "bồn tắm", "🛁"], ["lamp", "cái đèn", "💡"], ["TV", "ti vi", "📺"], ["clock", "đồng hồ", "⏰"],
        ["garden", "khu vườn", "🌷"], ["kitchen", "nhà bếp", "🍳"]
      ],
      sentences: [
        ["This is my house.", "Đây là nhà của tớ.", "🏠"],
        ["The cat is on the bed.", "Con mèo ở trên giường.", "🐱"],
        ["The ball is under the sofa.", "Quả bóng ở dưới ghế sô-pha.", "⚽"],
        ["Where is Mum? She is in the kitchen.", "Mẹ đâu rồi? Mẹ ở trong bếp.", "🍳"]
      ]
    },
    {
      id: "weather", level: 2, title: "Thời tiết & thiên nhiên", en: "Weather & Nature", icon: "🌈",
      words: [
        ["sun", "mặt trời", "☀️"], ["rain", "cơn mưa", "🌧️"], ["cloud", "đám mây", "☁️"], ["snow", "tuyết", "❄️"],
        ["wind", "gió", "🌬️"], ["rainbow", "cầu vồng", "🌈"], ["tree", "cái cây", "🌳"], ["flower", "bông hoa", "🌸"],
        ["moon", "mặt trăng", "🌙"], ["star", "ngôi sao", "⭐"]
      ],
      sentences: [
        ["It is sunny today.", "Hôm nay trời nắng.", "☀️"],
        ["It is raining.", "Trời đang mưa.", "🌧️"],
        ["What's the weather like? It's windy.", "Thời tiết thế nào? Trời có gió.", "🌬️"],
        ["Look! A rainbow!", "Nhìn kìa! Cầu vồng!", "🌈"]
      ]
    },
    {
      id: "actions", level: 2, title: "Hành động", en: "Actions", icon: "🏃",
      words: [
        ["run", "chạy", "🏃"], ["swim", "bơi", "🏊"], ["sing", "hát", "🎤"], ["dance", "nhảy múa", "💃"],
        ["read", "đọc", "📖"], ["write", "viết", "✍️"], ["draw", "vẽ", "🎨"], ["sleep", "ngủ", "😴"],
        ["ride a bike", "đạp xe", "🚴"], ["climb", "leo trèo", "🧗"]
      ],
      sentences: [
        ["I can swim.", "Tớ biết bơi.", "🏊"],
        ["Can you sing? Yes, I can.", "Bạn có biết hát không? Có, tớ biết.", "🎤"],
        ["Can you ride a bike? No, I can't.", "Bạn biết đạp xe không? Không, tớ không biết.", "🚴"],
        ["Let's dance!", "Cùng nhảy nào!", "💃"]
      ]
    },
    {
      id: "feelings", level: 2, title: "Cảm xúc", en: "Feelings", icon: "😊",
      words: [
        ["happy", "vui vẻ", "😊"], ["sad", "buồn", "😢"], ["angry", "tức giận", "😠"], ["scared", "sợ hãi", "😨"],
        ["tired", "mệt", "😫"], ["hot", "nóng", "🥵"], ["cold", "lạnh", "🥶"], ["surprised", "ngạc nhiên", "😮"],
        ["hungry", "đói", "🤤"]
      ],
      sentences: [
        ["I am happy.", "Tớ đang vui.", "😊"],
        ["How are you? I'm fine, thank you.", "Bạn khỏe không? Tớ khỏe, cảm ơn bạn.", "🙂"],
        ["She is sad.", "Bạn ấy đang buồn.", "😢"],
        ["Are you tired? Yes, I am.", "Bạn mệt à? Ừ, tớ mệt.", "😫"]
      ]
    },
    {
      id: "wild", level: 2, title: "Động vật hoang dã", en: "Wild Animals", icon: "🦁",
      words: [
        ["lion", "sư tử", "🦁"], ["tiger", "con hổ", "🐯"], ["elephant", "con voi", "🐘"], ["monkey", "con khỉ", "🐒"],
        ["giraffe", "hươu cao cổ", "🦒"], ["zebra", "ngựa vằn", "🦓"], ["bear", "con gấu", "🐻"], ["snake", "con rắn", "🐍"],
        ["crocodile", "cá sấu", "🐊"], ["penguin", "chim cánh cụt", "🐧"]
      ],
      sentences: [
        ["The elephant is big.", "Con voi rất to.", "🐘"],
        ["Monkeys can climb trees.", "Khỉ biết leo cây.", "🐒"],
        ["Let's go to the zoo!", "Cùng đi sở thú nào!", "🦁🐘"],
        ["The giraffe has a long neck.", "Hươu cao cổ có cái cổ dài.", "🦒"]
      ]
    },
    {
      id: "places", level: 2, title: "Nơi chốn", en: "Places", icon: "🏞️",
      words: [
        ["park", "công viên", "🏞️"], ["hospital", "bệnh viện", "🏥"], ["shop", "cửa hàng", "🏪"], ["beach", "bãi biển", "🏖️"],
        ["farm", "nông trại", "🚜"], ["library", "thư viện", "📚"], ["supermarket", "siêu thị", "🛒"], ["cinema", "rạp chiếu phim", "🎬"],
        ["zoo", "sở thú", "🦓"], ["school", "trường học", "🏫"]
      ],
      sentences: [
        ["I go to school.", "Tớ đi học.", "🏫"],
        ["We play in the park.", "Chúng tớ chơi ở công viên.", "🏞️"],
        ["Where are you going? To the beach!", "Bạn đi đâu thế? Ra biển!", "🏖️"],
        ["I read books in the library.", "Tớ đọc sách ở thư viện.", "📚"]
      ]
    },
    {
      id: "transport", level: 2, title: "Phương tiện", en: "Transport", icon: "🚌",
      words: [
        ["bus", "xe buýt", "🚌"], ["bike", "xe đạp", "🚲"], ["plane", "máy bay", "✈️"], ["boat", "thuyền", "⛵"],
        ["train", "tàu hỏa", "🚆"], ["motorbike", "xe máy", "🏍️"], ["taxi", "xe taxi", "🚕"], ["ship", "tàu thủy", "🚢"],
        ["helicopter", "trực thăng", "🚁"], ["truck", "xe tải", "🚚"]
      ],
      sentences: [
        ["I go to school by bus.", "Tớ đi học bằng xe buýt.", "🚌"],
        ["My dad rides a motorbike.", "Bố tớ đi xe máy.", "🏍️"],
        ["The plane is in the sky.", "Máy bay ở trên bầu trời.", "✈️"],
        ["How do you go to school? By bike.", "Bạn đi học bằng gì? Bằng xe đạp.", "🚲"]
      ]
    },
    {
      id: "num20", level: 2, title: "Số đếm 11–20", en: "Numbers 11–20", icon: "🔟",
      words: [
        ["eleven", "số mười một", "t:11"], ["twelve", "số mười hai", "t:12"], ["thirteen", "số mười ba", "t:13"],
        ["fourteen", "số mười bốn", "t:14"], ["fifteen", "số mười lăm", "t:15"], ["sixteen", "số mười sáu", "t:16"],
        ["seventeen", "số mười bảy", "t:17"], ["eighteen", "số mười tám", "t:18"], ["nineteen", "số mười chín", "t:19"],
        ["twenty", "số hai mươi", "t:20"]
      ],
      sentences: [
        ["How many birds? Twelve birds.", "Có bao nhiêu con chim? Mười hai con.", "🐦"],
        ["I have fifteen crayons.", "Tớ có mười lăm bút sáp màu.", "🖍️"],
        ["Ten and ten is twenty.", "Mười cộng mười là hai mươi.", "➕"]
      ]
    },
    {
      id: "days", level: 2, title: "Các ngày trong tuần", en: "Days of the Week", icon: "📅",
      words: [
        ["Monday", "thứ Hai", "t:Thứ 2"], ["Tuesday", "thứ Ba", "t:Thứ 3"], ["Wednesday", "thứ Tư", "t:Thứ 4"],
        ["Thursday", "thứ Năm", "t:Thứ 5"], ["Friday", "thứ Sáu", "t:Thứ 6"], ["Saturday", "thứ Bảy", "t:Thứ 7"],
        ["Sunday", "Chủ nhật", "t:CN"]
      ],
      sentences: [
        ["What day is it today? It's Monday.", "Hôm nay là thứ mấy? Hôm nay thứ Hai.", "📅"],
        ["I go swimming on Sunday.", "Tớ đi bơi vào Chủ nhật.", "🏊"],
        ["I have English on Friday.", "Tớ học tiếng Anh vào thứ Sáu.", "📘"]
      ]
    },

    // ================= CẤP 3: NÂNG CAO =================
    {
      id: "jobs", level: 3, title: "Nghề nghiệp", en: "Jobs", icon: "👩‍⚕️",
      words: [
        ["doctor", "bác sĩ", "👨‍⚕️"], ["nurse", "y tá", "👩‍⚕️"], ["teacher", "giáo viên", "👩‍🏫"], ["farmer", "nông dân", "👨‍🌾"],
        ["cook", "đầu bếp", "👨‍🍳"], ["police officer", "cảnh sát", "👮"], ["firefighter", "lính cứu hỏa", "👨‍🚒"],
        ["pilot", "phi công", "👨‍✈️"], ["singer", "ca sĩ", "👩‍🎤"], ["artist", "họa sĩ", "👩‍🎨"]
      ],
      sentences: [
        ["What does your mother do? She is a nurse.", "Mẹ bạn làm nghề gì? Mẹ tớ là y tá.", "👩‍⚕️"],
        ["I want to be a pilot.", "Tớ muốn trở thành phi công.", "👨‍✈️"],
        ["A farmer works on a farm.", "Nông dân làm việc ở nông trại.", "👨‍🌾"],
        ["Firefighters are very brave.", "Lính cứu hỏa rất dũng cảm.", "👨‍🚒"]
      ]
    },
    {
      id: "routine", level: 3, title: "Một ngày của em", en: "My Day", icon: "⏰",
      words: [
        ["get up", "thức dậy", "🌅"], ["have breakfast", "ăn sáng", "🥣"], ["go to school", "đi học", "🏫"],
        ["do homework", "làm bài tập", "📝"], ["watch TV", "xem ti vi", "📺"], ["take a shower", "tắm", "🚿"],
        ["have dinner", "ăn tối", "🍲"], ["go to bed", "đi ngủ", "🛏️"]
      ],
      sentences: [
        ["I get up at six o'clock.", "Tớ thức dậy lúc sáu giờ.", "🕕"],
        ["What time do you go to school? At seven o'clock.", "Bạn đi học lúc mấy giờ? Lúc bảy giờ.", "🕖"],
        ["I do my homework after school.", "Tớ làm bài tập sau giờ học.", "📝"],
        ["I go to bed at nine o'clock.", "Tớ đi ngủ lúc chín giờ.", "🕘"]
      ]
    },
    {
      id: "sports", level: 3, title: "Thể thao & sở thích", en: "Sports & Hobbies", icon: "⚽",
      words: [
        ["football", "bóng đá", "⚽"], ["basketball", "bóng rổ", "🏀"], ["badminton", "cầu lông", "🏸"], ["swimming", "bơi lội", "🏊"],
        ["tennis", "quần vợt", "🎾"], ["chess", "cờ vua", "♟️"], ["skating", "trượt băng", "⛸️"], ["volleyball", "bóng chuyền", "🏐"],
        ["table tennis", "bóng bàn", "🏓"], ["painting", "vẽ tranh", "🎨"]
      ],
      sentences: [
        ["What's your hobby? I like painting.", "Sở thích của bạn là gì? Tớ thích vẽ tranh.", "🎨"],
        ["Let's play football!", "Cùng chơi bóng đá nào!", "⚽"],
        ["He is playing basketball.", "Bạn ấy đang chơi bóng rổ.", "🏀"],
        ["I don't like chess.", "Tớ không thích cờ vua.", "♟️"]
      ]
    },
    {
      id: "sea", level: 3, title: "Biển cả", en: "Under the Sea", icon: "🐳",
      words: [
        ["whale", "cá voi", "🐳"], ["dolphin", "cá heo", "🐬"], ["octopus", "bạch tuộc", "🐙"], ["crab", "con cua", "🦀"],
        ["shark", "cá mập", "🦈"], ["turtle", "con rùa", "🐢"], ["shell", "vỏ sò", "🐚"], ["squid", "con mực", "🦑"],
        ["lobster", "tôm hùm", "🦞"]
      ],
      sentences: [
        ["An octopus has eight legs.", "Bạch tuộc có tám cái chân.", "🐙"],
        ["Dolphins are very clever.", "Cá heo rất thông minh.", "🐬"],
        ["The whale is the biggest animal.", "Cá voi là loài vật to nhất.", "🐳"],
        ["Crabs walk sideways.", "Cua bò ngang.", "🦀"]
      ]
    },
    {
      id: "veg", level: 3, title: "Rau củ", en: "Vegetables", icon: "🥕",
      words: [
        ["carrot", "cà rốt", "🥕"], ["tomato", "cà chua", "🍅"], ["potato", "khoai tây", "🥔"], ["corn", "ngô", "🌽"],
        ["cucumber", "dưa chuột", "🥒"], ["broccoli", "súp lơ xanh", "🥦"], ["onion", "củ hành", "🧅"], ["mushroom", "nấm", "🍄"],
        ["pepper", "quả ớt", "🌶️"]
      ],
      sentences: [
        ["Rabbits like carrots.", "Thỏ thích cà rốt.", "🐰"],
        ["Vegetables are good for you.", "Rau củ rất tốt cho con.", "🥦"],
        ["Would you like some corn? Yes, please.", "Bạn ăn ngô không? Có, cảm ơn.", "🌽"],
        ["The pepper is very hot!", "Quả ớt cay quá!", "🌶️"]
      ]
    },
    {
      id: "opposites", level: 3, title: "Từ trái nghĩa", en: "Opposites", icon: "↔️",
      words: [
        ["big", "to", "🐘"], ["small", "nhỏ", "🐭"], ["fast", "nhanh", "🐆"], ["slow", "chậm", "🐢"],
        ["tall", "cao", "🦒"], ["long", "dài", "🐍"], ["hot", "nóng", "🔥"], ["cold", "lạnh", "🧊"],
        ["old", "già", "👴"], ["young", "trẻ", "👶"]
      ],
      sentences: [
        ["The elephant is big, but the mouse is small.", "Con voi thì to, nhưng con chuột thì nhỏ.", "🐘🐭"],
        ["The cheetah is fast. The turtle is slow.", "Báo săn chạy nhanh. Rùa đi chậm.", "🐆🐢"],
        ["Fire is hot. Ice is cold.", "Lửa thì nóng. Đá thì lạnh.", "🔥🧊"],
        ["My grandfather is old. My baby brother is young.", "Ông tớ đã già. Em trai tớ còn nhỏ.", "👴👶"]
      ]
    },
    {
      id: "seasons", level: 3, title: "Bốn mùa", en: "Seasons", icon: "🍂",
      words: [
        ["spring", "mùa xuân", "🌸"], ["summer", "mùa hè", "🏖️"], ["autumn", "mùa thu", "🍂"], ["winter", "mùa đông", "⛄"],
        ["umbrella", "cái ô", "☂️"], ["kite", "cái diều", "🪁"], ["snowman", "người tuyết", "☃️"], ["leaf", "chiếc lá", "🍁"]
      ],
      sentences: [
        ["It is hot in summer.", "Mùa hè trời nóng.", "☀️"],
        ["Leaves fall in autumn.", "Lá rơi vào mùa thu.", "🍂"],
        ["We can make a snowman in winter.", "Mùa đông chúng tớ có thể làm người tuyết.", "☃️"],
        ["Which season do you like? I like spring.", "Bạn thích mùa nào? Tớ thích mùa xuân.", "🌸"]
      ]
    },
    {
      id: "now", level: 3, title: "Đang làm gì?", en: "What Are You Doing?", icon: "🎬",
      words: [
        ["cooking", "đang nấu ăn", "👩‍🍳"], ["reading", "đang đọc", "📖"], ["sleeping", "đang ngủ", "😴"], ["eating", "đang ăn", "😋"],
        ["drinking", "đang uống", "🥤"], ["singing", "đang hát", "🎤"], ["running", "đang chạy", "🏃"], ["swimming", "đang bơi", "🏊"],
        ["playing", "đang chơi", "🎮"], ["drawing", "đang vẽ", "🎨"]
      ],
      sentences: [
        ["What are you doing? I am reading.", "Bạn đang làm gì? Tớ đang đọc sách.", "📖"],
        ["My mum is cooking in the kitchen.", "Mẹ tớ đang nấu ăn trong bếp.", "👩‍🍳"],
        ["The baby is sleeping.", "Em bé đang ngủ.", "😴"],
        ["They are swimming in the sea.", "Họ đang bơi ở biển.", "🏊"],
        ["Is he running? Yes, he is.", "Bạn ấy đang chạy à? Đúng vậy.", "🏃"]
      ]
    },
    { id: "stories", level: 3, title: "Đọc truyện", en: "Story Time", icon: "📚", type: "story" }
  ],

  alphabet: [
    ["A", "apple", "🍎"], ["B", "ball", "⚽"], ["C", "cat", "🐱"], ["D", "dog", "🐶"], ["E", "egg", "🥚"],
    ["F", "fish", "🐟"], ["G", "grapes", "🍇"], ["H", "hat", "👒"], ["I", "ice cream", "🍦"], ["J", "juice", "🧃"],
    ["K", "kite", "🪁"], ["L", "lion", "🦁"], ["M", "monkey", "🐒"], ["N", "nose", "👃"], ["O", "orange", "🍊"],
    ["P", "pig", "🐷"], ["Q", "queen", "👸"], ["R", "rabbit", "🐰"], ["S", "sun", "☀️"], ["T", "tiger", "🐯"],
    ["U", "umbrella", "☂️"], ["V", "violin", "🎻"], ["W", "whale", "🐳"], ["X", "box", "📦"], ["Y", "yo-yo", "🪀"],
    ["Z", "zebra", "🦓"]
  ],

  stories: [
    {
      title: "Tom's Cat", vi: "Chú mèo của Tom", icon: "🐱",
      lines: [
        ["This is Tom. He is seven.", "Đây là Tom. Cậu ấy bảy tuổi.", "👦"],
        ["Tom has a cat. Her name is Kitty.", "Tom có một con mèo. Tên nó là Kitty.", "🐱"],
        ["Kitty is white and small.", "Kitty màu trắng và nhỏ xíu.", "🐈"],
        ["Kitty likes fish and milk.", "Kitty thích cá và sữa.", "🐟🥛"],
        ["Tom and Kitty play in the garden.", "Tom và Kitty chơi trong vườn.", "🌷"]
      ],
      questions: [
        ["How old is Tom?", "Tom mấy tuổi?", ["seven", "six", "eight"]],
        ["What is the cat's name?", "Con mèo tên là gì?", ["Kitty", "Tom", "Lucy"]],
        ["What colour is Kitty?", "Kitty màu gì?", ["white", "black", "brown"]],
        ["Where do they play?", "Họ chơi ở đâu?", ["in the garden", "at school", "in the kitchen"]]
      ]
    },
    {
      title: "A Day at the Beach", vi: "Một ngày ở biển", icon: "🏖️",
      lines: [
        ["It is summer. It is hot and sunny.", "Đang là mùa hè. Trời nóng và nắng.", "☀️"],
        ["Mai and her family go to the beach.", "Mai và gia đình đi biển.", "🏖️"],
        ["Mai swims in the sea with her dad.", "Mai bơi ở biển cùng bố.", "🏊"],
        ["Her brother makes a sandcastle.", "Em trai bạn ấy xây lâu đài cát.", "🏰"],
        ["They eat ice cream. They are very happy.", "Họ ăn kem. Họ rất vui.", "🍦😊"]
      ],
      questions: [
        ["What season is it?", "Đang là mùa gì?", ["summer", "winter", "spring"]],
        ["Who does Mai swim with?", "Mai bơi cùng ai?", ["her dad", "her mum", "her teacher"]],
        ["What does her brother make?", "Em trai bạn ấy làm gì?", ["a sandcastle", "a kite", "a cake"]],
        ["How do they feel?", "Họ cảm thấy thế nào?", ["happy", "sad", "angry"]]
      ]
    },
    {
      title: "The Hungry Monkey", vi: "Chú khỉ đói bụng", icon: "🐒",
      lines: [
        ["Momo is a little monkey.", "Momo là một chú khỉ nhỏ.", "🐒"],
        ["He lives in a big tree.", "Chú sống trên một cái cây to.", "🌳"],
        ["One morning, Momo is very hungry.", "Một buổi sáng, Momo rất đói.", "🤤"],
        ["He climbs down and finds three bananas.", "Chú trèo xuống và tìm thấy ba quả chuối.", "🍌🍌🍌"],
        ["He gives one banana to his friend, the bird.", "Chú tặng một quả chuối cho bạn chim.", "🐦"],
        ["Sharing is good!", "Chia sẻ thật tuyệt!", "💛"]
      ],
      questions: [
        ["Where does Momo live?", "Momo sống ở đâu?", ["in a big tree", "in a house", "in the sea"]],
        ["How many bananas does he find?", "Chú tìm thấy mấy quả chuối?", ["three", "two", "five"]],
        ["Who is his friend?", "Bạn của chú là ai?", ["the bird", "the fish", "the cat"]],
        ["Is Momo hungry in the morning?", "Buổi sáng Momo có đói không?", ["Yes, he is.", "No, he isn't.", "I don't know."]]
      ]
    },
    {
      title: "My Birthday", vi: "Sinh nhật của tớ", icon: "🎂",
      lines: [
        ["Today is Sunday. It is my birthday!", "Hôm nay là Chủ nhật. Là sinh nhật tớ!", "🎂"],
        ["I am six years old.", "Tớ sáu tuổi.", "6️⃣"],
        ["My friends come to my house.", "Các bạn đến nhà tớ.", "🏠"],
        ["Mum makes a big chocolate cake.", "Mẹ làm một chiếc bánh sô-cô-la thật to.", "🍰"],
        ["Dad gives me a red bike.", "Bố tặng tớ một chiếc xe đạp màu đỏ.", "🚲"],
        ["We sing and dance. What a great day!", "Chúng tớ hát và nhảy. Thật là một ngày tuyệt vời!", "🎉"]
      ],
      questions: [
        ["What day is the birthday?", "Sinh nhật vào thứ mấy?", ["Sunday", "Monday", "Friday"]],
        ["How old is the child?", "Bạn nhỏ mấy tuổi?", ["six", "seven", "five"]],
        ["What does Dad give?", "Bố tặng gì?", ["a bike", "a ball", "a doll"]],
        ["What colour is the bike?", "Xe đạp màu gì?", ["red", "blue", "green"]]
      ]
    },
    {
      title: "Ben Goes to School", vi: "Ben đi học", icon: "🏫",
      lines: [
        ["Ben gets up at six o'clock.", "Ben thức dậy lúc sáu giờ.", "⏰"],
        ["He brushes his teeth and has breakfast.", "Cậu đánh răng và ăn sáng.", "🥣"],
        ["He goes to school by bus.", "Cậu đi học bằng xe buýt.", "🚌"],
        ["At school, he reads books and draws pictures.", "Ở trường, cậu đọc sách và vẽ tranh.", "📖🎨"],
        ["His favourite subject is English.", "Môn học yêu thích của cậu là tiếng Anh.", "📘"],
        ["After school, he plays football with his friends.", "Sau giờ học, cậu đá bóng với các bạn.", "⚽"]
      ],
      questions: [
        ["What time does Ben get up?", "Ben thức dậy lúc mấy giờ?", ["at six o'clock", "at eight o'clock", "at ten o'clock"]],
        ["How does Ben go to school?", "Ben đi học bằng gì?", ["by bus", "by bike", "by car"]],
        ["What is his favourite subject?", "Môn học yêu thích của Ben là gì?", ["English", "Maths", "Music"]],
        ["What does he play after school?", "Sau giờ học Ben chơi gì?", ["football", "chess", "tennis"]]
      ]
    },
    {
      title: "Lily and the Rainbow", vi: "Lily và cầu vồng", icon: "🌈",
      lines: [
        ["It is raining. Lily is sad.", "Trời đang mưa. Lily buồn.", "🌧️😢"],
        ["She cannot play in the park.", "Bạn ấy không thể chơi ở công viên.", "🏞️"],
        ["She draws a picture with her crayons.", "Bạn ấy vẽ một bức tranh bằng bút sáp màu.", "🖍️"],
        ["Then the rain stops and the sun comes out.", "Rồi mưa tạnh và mặt trời ló ra.", "🌤️"],
        ["Look! There is a rainbow in the sky!", "Nhìn kìa! Có cầu vồng trên bầu trời!", "🌈"],
        ["Now Lily is happy.", "Bây giờ Lily vui rồi.", "😊"]
      ],
      questions: [
        ["Why is Lily sad?", "Vì sao Lily buồn?", ["It is raining.", "She is hungry.", "She is tired."]],
        ["What does Lily draw with?", "Lily vẽ bằng gì?", ["crayons", "a pen", "a ruler"]],
        ["What is in the sky?", "Trên bầu trời có gì?", ["a rainbow", "a plane", "a kite"]],
        ["How does Lily feel at the end?", "Cuối truyện Lily cảm thấy thế nào?", ["happy", "sad", "scared"]]
      ]
    }
  ]
};
