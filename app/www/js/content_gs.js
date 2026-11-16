/* Nội dung học theo phương pháp GrapeSEED (học qua vè – hội thoại – truyện, nghe nhiều, ngữ cảnh có nghĩa).
 * Toàn bộ vè, hội thoại, truyện dưới đây là nội dung tự viết mới cho app, không sao chép tài liệu GrapeSEED.
 * chant: [[câu tiếng Anh, nghĩa]]                      – vè đọc theo nhịp (có động tác)
 * talk:  [[hỏi EN, hỏi VI, đáp EN, đáp VI, hình]]       – hội thoại mẫu, bé luyện trả lời
 * tale:  [[câu EN, nghĩa, hình]]                        – truyện ngắn (mỗi câu một hình khác nhau)
 */
window.GS = {
  abc: {
    chant: [
      ["A, B, C, D, E, F, G!", "A, B, C, D, E, F, G!"],
      ["H, I, J, K, L, M, N!", "H, I, J, K, L, M, N!"],
      ["O, P, Q, R, S, T, U!", "O, P, Q, R, S, T, U!"],
      ["V, W, X, Y, Z!", "V, W, X, Y, Z!"],
      ["Now I can say my letters with you!", "Giờ tớ đọc được bảng chữ cái cùng bạn rồi!"]
    ]
  },
  hello: {
    chant: [
      ["Hello, hello, how are you?", "Xin chào, xin chào, bạn khỏe không?"],
      ["I am fine, and how are you?", "Tớ khỏe, còn bạn thì sao?"],
      ["Wave your hand and say hello!", "Vẫy tay và nói xin chào nào!"],
      ["Goodbye, goodbye, off we go!", "Tạm biệt, tạm biệt, mình đi thôi!"]
    ],
    talk: [
      ["Hello! What's your name?", "Xin chào! Bạn tên là gì?", "My name is Nam.", "Tớ tên là Nam.", "👦"],
      ["How are you?", "Bạn khỏe không?", "I am fine, thank you.", "Tớ khỏe, cảm ơn bạn.", "😊"],
      ["Are you a boy or a girl?", "Bạn là con trai hay con gái?", "I am a girl.", "Tớ là con gái.", "👧"]
    ],
    tale: [
      ["It is the first day of school.", "Hôm nay là ngày đầu tiên đi học.", "🏫"],
      ["Nam sees a girl. She is sad.", "Nam thấy một bạn gái. Bạn ấy đang buồn.", "😢"],
      ["Nam says, Hello! I am Nam.", "Nam nói: Xin chào! Tớ là Nam.", "👋"],
      ["The girl says, Hi! I am Mai.", "Bạn gái nói: Chào cậu! Tớ là Mai.", "👧"],
      ["Now they are friends. They are happy!", "Giờ họ là bạn bè. Họ rất vui!", "👫"]
    ]
  },
  colors: {
    chant: [
      ["Red, red, a red apple.", "Đỏ, đỏ, quả táo đỏ.", ],
      ["Yellow, yellow, a yellow sun.", "Vàng, vàng, mặt trời vàng."],
      ["Green, green, a green frog.", "Xanh, xanh, chú ếch xanh."],
      ["Blue, blue, the big blue sky.", "Xanh dương, bầu trời xanh rộng lớn."],
      ["Colors, colors, so much fun!", "Màu sắc, màu sắc, vui quá đi!"]
    ],
    talk: [
      ["What color is it?", "Nó màu gì?", "It is red.", "Nó màu đỏ.", "🍎"],
      ["What color is the frog?", "Con ếch màu gì?", "It is green.", "Nó màu xanh lá.", "🐸"],
      ["What is your favorite color?", "Màu yêu thích của bạn là gì?", "I like pink.", "Tớ thích màu hồng.", "🌸"]
    ],
    tale: [
      ["Lily has a box of crayons.", "Lily có một hộp bút sáp màu.", "🖍️"],
      ["She draws a red apple.", "Bạn ấy vẽ một quả táo đỏ.", "🍎"],
      ["She draws a yellow sun.", "Bạn ấy vẽ một mặt trời màu vàng.", "☀️"],
      ["She draws a green tree.", "Bạn ấy vẽ một cái cây xanh.", "🌳"],
      ["Look! A beautiful picture!", "Nhìn kìa! Một bức tranh thật đẹp!", "🖼️"]
    ]
  },
  num10: {
    chant: [
      ["One, two, buckle my shoe.", "Một, hai, buộc dây giày."],
      ["Three, four, open the door.", "Ba, bốn, mở cửa ra."],
      ["Five, six, pick up sticks.", "Năm, sáu, nhặt que lên."],
      ["Seven, eight, don't be late.", "Bảy, tám, đừng đến muộn."],
      ["Nine, ten, let's count again!", "Chín, mười, đếm lại nào!"]
    ],
    talk: [
      ["How old are you?", "Bạn mấy tuổi?", "I am six.", "Tớ sáu tuổi.", "🎂"],
      ["How many cats?", "Có mấy con mèo?", "Two cats.", "Hai con mèo.", "🐱"],
      ["How many apples?", "Có mấy quả táo?", "Three apples.", "Ba quả táo.", "🍎"]
    ],
    tale: [
      ["Ben has one red ball.", "Ben có một quả bóng đỏ.", "⚽"],
      ["Mum gives him two bananas.", "Mẹ cho cậu hai quả chuối.", "🍌"],
      ["He sees three birds in the tree.", "Cậu nhìn thấy ba con chim trên cây.", "🐦"],
      ["He counts four fish in the pond.", "Cậu đếm được bốn con cá dưới ao.", "🐟"],
      ["Five stars come out at night. Good night, Ben!", "Năm ngôi sao hiện ra vào ban đêm. Chúc Ben ngủ ngon!", "⭐"]
    ]
  },
  pets: {
    chant: [
      ["The cat says meow, meow, meow.", "Con mèo kêu meo, meo, meo."],
      ["The dog says woof, woof, woof.", "Con chó sủa gâu, gâu, gâu."],
      ["The duck says quack, quack, quack.", "Con vịt kêu cạp, cạp, cạp."],
      ["The cow says moo, moo, moo.", "Con bò kêu ò, ò, ò."],
      ["Animals, animals, I love you!", "Các con vật ơi, tớ yêu các bạn!"]
    ],
    talk: [
      ["What is it?", "Đây là con gì?", "It is a dog.", "Đó là con chó.", "🐶"],
      ["Do you have a pet?", "Bạn có thú cưng không?", "Yes, I have a cat.", "Có, tớ có một con mèo.", "🐱"],
      ["Can a bird fly?", "Chim có biết bay không?", "Yes, it can.", "Có, nó biết bay.", "🐦"]
    ],
    tale: [
      ["Grandpa has a farm.", "Ông có một nông trại.", "🚜"],
      ["The hen has five little chicks.", "Gà mẹ có năm chú gà con.", "🐔"],
      ["The pig likes the mud.", "Chú lợn thích bùn.", "🐷"],
      ["The horse runs very fast.", "Chú ngựa chạy rất nhanh.", "🐴"],
      ["I love Grandpa's farm!", "Tớ yêu nông trại của ông!", "❤️"]
    ]
  },
  family: {
    chant: [
      ["This is my mother, she loves me.", "Đây là mẹ tớ, mẹ yêu tớ."],
      ["This is my father, strong as can be.", "Đây là bố tớ, bố khỏe lắm."],
      ["Brother and sister, play with me.", "Anh chị em ơi, chơi với tớ nào."],
      ["Grandma, grandpa, one, two, three.", "Bà ơi, ông ơi, một, hai, ba."],
      ["We are a happy family!", "Chúng tớ là một gia đình hạnh phúc!"]
    ],
    talk: [
      ["Who is she?", "Đây là ai?", "She is my mother.", "Đây là mẹ tớ.", "👩"],
      ["Who is he?", "Đây là ai?", "He is my grandfather.", "Đây là ông tớ.", "👴"],
      ["Do you have a brother?", "Bạn có anh trai không?", "Yes, I do.", "Có, tớ có.", "👦"]
    ],
    tale: [
      ["It is Sunday. My family is at home.", "Hôm nay Chủ nhật. Cả nhà tớ ở nhà.", "🏠"],
      ["Dad is cooking lunch.", "Bố đang nấu bữa trưa.", "🍳"],
      ["Mum is reading a book.", "Mẹ đang đọc sách.", "📖"],
      ["Grandma tells a story to the baby.", "Bà kể chuyện cho em bé nghe.", "👶"],
      ["We eat together. I love my family!", "Cả nhà ăn cùng nhau. Tớ yêu gia đình tớ!", "👨‍👩‍👧"]
    ]
  },
  body: {
    chant: [
      ["Head and shoulders, clap, clap, clap!", "Đầu và vai, vỗ tay, vỗ, vỗ!"],
      ["Touch your nose and touch your ear.", "Chạm vào mũi, chạm vào tai."],
      ["Stamp your feet, stamp, stamp, stamp!", "Dậm chân nào, dậm, dậm, dậm!"],
      ["Open your mouth and close your eyes.", "Há miệng ra rồi nhắm mắt lại."],
      ["Wave your arms up to the sky!", "Vẫy tay lên tận bầu trời!"]
    ],
    talk: [
      ["What is this?", "Đây là gì?", "This is my nose.", "Đây là mũi của tớ.", "👃"],
      ["How many eyes do you have?", "Bạn có mấy con mắt?", "I have two eyes.", "Tớ có hai con mắt.", "👀"],
      ["How many fingers do you have?", "Bạn có mấy ngón tay?", "I have ten fingers.", "Tớ có mười ngón tay.", "✋"]
    ],
    tale: [
      ["Tom wakes up in the morning.", "Tom thức dậy vào buổi sáng.", "🌅"],
      ["He washes his face and hands.", "Cậu rửa mặt và rửa tay.", "🧼"],
      ["He brushes his teeth.", "Cậu đánh răng.", "🦷"],
      ["He puts on his shoes on his feet.", "Cậu đi giày vào chân.", "👟"],
      ["Tom is ready for school!", "Tom đã sẵn sàng đi học!", "🎒"]
    ]
  },
  fruits: {
    chant: [
      ["Apples, apples, red and round.", "Táo ơi táo, đỏ và tròn."],
      ["Bananas, bananas, long and yellow.", "Chuối ơi chuối, dài và vàng."],
      ["Grapes, grapes, small and purple.", "Nho ơi nho, nhỏ và tím."],
      ["Watermelon, big and green.", "Dưa hấu to, vỏ xanh."],
      ["Yummy, yummy, in my tummy!", "Ngon ơi là ngon, vào bụng thôi!"]
    ],
    talk: [
      ["Do you like bananas?", "Bạn có thích chuối không?", "Yes, I do.", "Có, tớ thích.", "🍌"],
      ["What fruit do you like?", "Bạn thích quả gì?", "I like mangoes.", "Tớ thích xoài.", "🥭"],
      ["Is the lemon sweet?", "Quả chanh có ngọt không?", "No, it is sour.", "Không, nó chua.", "🍋"]
    ],
    tale: [
      ["Mai goes to the market with Mum.", "Mai đi chợ cùng mẹ.", "🛒"],
      ["They buy a big watermelon.", "Hai mẹ con mua một quả dưa hấu to.", "🍉"],
      ["They buy some yellow bananas.", "Họ mua vài quả chuối vàng.", "🍌"],
      ["Mai wants strawberries too.", "Mai muốn mua cả dâu tây nữa.", "🍓"],
      ["At home, they make a fruit salad. Yummy!", "Về nhà, hai mẹ con làm món sa-lát hoa quả. Ngon tuyệt!", "🥗"]
    ]
  },
  toys: {
    chant: [
      ["Bounce, bounce, bounce my ball.", "Nảy, nảy, nảy quả bóng."],
      ["Fly, fly, fly my kite.", "Bay, bay, bay cánh diều."],
      ["Beep, beep, goes my car.", "Bíp, bíp, xe ô tô của tớ."],
      ["Choo, choo, goes my train.", "Tu, tu, tàu hỏa chạy."],
      ["Toys, toys, let's play again!", "Đồ chơi ơi, mình chơi tiếp nào!"]
    ],
    talk: [
      ["What is your favorite toy?", "Đồ chơi yêu thích của bạn là gì?", "My teddy bear.", "Gấu bông của tớ.", "🧸"],
      ["Can I play with your ball?", "Tớ chơi bóng của bạn được không?", "Yes, here you are.", "Được, của bạn đây.", "⚽"],
      ["Where is my robot?", "Rô-bốt của tớ đâu rồi?", "It is in the box.", "Nó ở trong hộp.", "🤖"]
    ],
    tale: [
      ["It is Bin's birthday today.", "Hôm nay là sinh nhật Bin.", "🎂"],
      ["He gets a box from Grandma.", "Cậu nhận được một chiếc hộp từ bà.", "🎁"],
      ["He opens it. It is a red robot!", "Cậu mở ra. Đó là một chú rô-bốt màu đỏ!", "🤖"],
      ["The robot can walk and dance.", "Rô-bốt biết đi và nhảy múa.", "💃"],
      ["Bin says, Thank you, Grandma!", "Bin nói: Cháu cảm ơn bà ạ!", "🙏"]
    ]
  },
  school: {
    chant: [
      ["This is the way we go to school.", "Đây là cách chúng mình đến trường."],
      ["Open your book and read with me.", "Mở sách ra và đọc cùng tớ."],
      ["Take your pencil, write A, B, C.", "Cầm bút chì lên, viết A, B, C."],
      ["Sit down, stand up, one, two, three!", "Ngồi xuống, đứng lên, một, hai, ba!"],
      ["I love school, yes, I do!", "Tớ yêu trường lớp lắm đấy!"]
    ],
    talk: [
      ["What is this?", "Đây là cái gì?", "It is a pencil.", "Đó là bút chì.", "✏️"],
      ["May I come in?", "Con vào lớp được không ạ?", "Yes, come in, please.", "Được, mời con vào.", "🚪"],
      ["Do you have a ruler?", "Bạn có thước kẻ không?", "Yes, I have a ruler.", "Có, tớ có thước kẻ.", "📏"]
    ],
    tale: [
      ["Linh has a new school bag.", "Linh có một chiếc cặp sách mới.", "🎒"],
      ["In her bag there is a book.", "Trong cặp có một quyển sách.", "📖"],
      ["There is a pencil and a ruler.", "Có một bút chì và một thước kẻ.", "✏️"],
      ["There are many crayons too.", "Còn có nhiều bút sáp màu nữa.", "🖍️"],
      ["Linh is ready to learn!", "Linh đã sẵn sàng học bài!", "🏫"]
    ]
  },
  shapes: {
    chant: [
      ["A circle is round like the sun.", "Hình tròn tròn như mặt trời."],
      ["A square has four sides, it is fun.", "Hình vuông có bốn cạnh, vui ghê."],
      ["A triangle has three, one, two, three.", "Hình tam giác có ba cạnh: một, hai, ba."],
      ["A star shines bright for you and me.", "Ngôi sao tỏa sáng cho bạn và tớ."],
      ["Shapes, shapes, look and see!", "Hình khối ơi, nhìn kỹ nhé!"]
    ],
    talk: [
      ["What shape is it?", "Đây là hình gì?", "It is a triangle.", "Đó là hình tam giác.", "🔺"],
      ["Is the ball a square?", "Quả bóng có phải hình vuông không?", "No, it is a circle.", "Không, nó là hình tròn.", "⚽"],
      ["Can you draw a heart?", "Bạn vẽ được trái tim không?", "Yes, I can.", "Có, tớ vẽ được.", "❤️"]
    ],
    tale: [
      ["Kim wants to make a card for Mum.", "Kim muốn làm một tấm thiệp tặng mẹ.", "💌"],
      ["She cuts a big red heart.", "Bạn ấy cắt một trái tim to màu đỏ.", "❤️"],
      ["She adds a yellow star.", "Bạn ấy thêm một ngôi sao màu vàng.", "⭐"],
      ["She draws a blue circle.", "Bạn ấy vẽ một hình tròn màu xanh.", "🔵"],
      ["Mum smiles. I love it, Kim!", "Mẹ mỉm cười: Mẹ thích lắm, Kim ạ!", "😊"]
    ]
  },
  food: {
    chant: [
      ["Rice in the morning, yum, yum, yum.", "Buổi sáng ăn cơm, ngon, ngon, ngon."],
      ["Milk in a glass, good for my tum.", "Cốc sữa thơm, tốt cho bụng."],
      ["Bread and eggs, a happy lunch.", "Bánh mì và trứng, bữa trưa vui."],
      ["Ice cream, ice cream, munch, munch, munch!", "Kem ơi kem, măm, măm, măm!"],
      ["Wash your hands before you eat!", "Rửa tay sạch trước khi ăn nhé!"]
    ],
    talk: [
      ["Are you hungry?", "Bạn có đói không?", "Yes, I am hungry.", "Có, tớ đói rồi.", "😋"],
      ["What would you like?", "Bạn muốn ăn gì?", "I would like some noodles.", "Tớ muốn ăn mì.", "🍜"],
      ["Would you like some milk?", "Bạn uống sữa nhé?", "Yes, please.", "Vâng, cảm ơn.", "🥛"]
    ],
    tale: [
      ["Today Dad and Bo make breakfast.", "Hôm nay bố và Bo làm bữa sáng.", "🍳"],
      ["Bo breaks two eggs.", "Bo đập hai quả trứng.", "🥚"],
      ["Dad makes some bread.", "Bố làm bánh mì.", "🍞"],
      ["Bo pours the orange juice.", "Bo rót nước cam.", "🧃"],
      ["Mum says, Wow! Thank you, my chefs!", "Mẹ nói: Ôi! Cảm ơn hai đầu bếp của mẹ!", "👩"]
    ]
  },
  clothes: {
    chant: [
      ["Put on your T-shirt, one, two.", "Mặc áo phông vào, một, hai."],
      ["Put on your socks and put on your shoes.", "Đi tất vào, rồi đi giày vào."],
      ["Put on your hat, it is sunny today.", "Đội mũ lên, hôm nay trời nắng."],
      ["Put on your jacket, it is cold today.", "Mặc áo khoác, hôm nay trời lạnh."],
      ["Now I am ready, let's go and play!", "Giờ tớ sẵn sàng, đi chơi thôi!"]
    ],
    talk: [
      ["What are you wearing?", "Bạn đang mặc gì?", "I am wearing a dress.", "Tớ đang mặc váy.", "👗"],
      ["Where are my socks?", "Tất của tớ đâu rồi?", "They are under the bed.", "Chúng ở dưới gầm giường.", "🧦"],
      ["Is it cold today?", "Hôm nay trời có lạnh không?", "Yes. Wear your jacket.", "Có. Mặc áo khoác vào nhé.", "🧥"]
    ],
    tale: [
      ["Today is a windy day.", "Hôm nay trời nhiều gió.", "🌬️"],
      ["Huy puts on his blue cap.", "Huy đội chiếc mũ lưỡi trai màu xanh.", "🧢"],
      ["Whoosh! The wind takes his cap!", "Vù! Gió thổi bay mất mũ của cậu!", "💨"],
      ["A dog runs and catches it.", "Một chú chó chạy tới và đớp được chiếc mũ.", "🐶"],
      ["Huy says, Good dog! Thank you!", "Huy nói: Chó ngoan quá! Cảm ơn nhé!", "😄"]
    ]
  },
  house: {
    chant: [
      ["This is my house, come and see.", "Đây là nhà tớ, đến xem nào."],
      ["A bed for sleeping, a lamp for me.", "Giường để ngủ, đèn cho tớ."],
      ["A kitchen for cooking, a bath for fun.", "Bếp để nấu ăn, bồn tắm vui ghê."],
      ["A garden with flowers in the sun.", "Khu vườn đầy hoa dưới nắng."],
      ["Home, sweet home, for everyone!", "Ngôi nhà thân yêu của mọi người!"]
    ],
    talk: [
      ["Where is the cat?", "Con mèo ở đâu?", "It is on the sofa.", "Nó ở trên ghế sô-pha.", "🛋️"],
      ["Where is Mum?", "Mẹ đâu rồi?", "She is in the kitchen.", "Mẹ ở trong bếp.", "🍳"],
      ["Is the ball under the bed?", "Quả bóng có ở dưới gầm giường không?", "Yes, it is.", "Có, nó ở đó.", "🛏️"]
    ],
    tale: [
      ["Kitty the cat is lost.", "Mèo Kitty bị lạc mất rồi.", "🐱"],
      ["Is she in the kitchen? No!", "Nó có trong bếp không? Không!", "🍳"],
      ["Is she in the bath? No!", "Nó có trong bồn tắm không? Không!", "🛁"],
      ["Is she in the garden? No!", "Nó có ngoài vườn không? Không!", "🌷"],
      ["Look! She is sleeping on my bed!", "Nhìn kìa! Nó đang ngủ trên giường của tớ!", "🛏️"]
    ]
  },
  weather: {
    chant: [
      ["Sun, sun, shine on me.", "Mặt trời ơi, chiếu sáng nào."],
      ["Rain, rain, pitter patter.", "Mưa ơi mưa, tí tách rơi."],
      ["Wind, wind, blow the leaves.", "Gió ơi gió, thổi lá bay."],
      ["Snow, snow, cold and white.", "Tuyết ơi tuyết, trắng và lạnh."],
      ["Rainbow, rainbow, colors so bright!", "Cầu vồng ơi, màu thật tươi!"]
    ],
    talk: [
      ["What's the weather like today?", "Hôm nay thời tiết thế nào?", "It is sunny.", "Trời nắng.", "☀️"],
      ["Is it raining?", "Trời có đang mưa không?", "Yes, it is raining.", "Có, trời đang mưa.", "🌧️"],
      ["Do you need an umbrella?", "Bạn có cần ô không?", "Yes, I do.", "Có, tớ cần.", "☂️"]
    ],
    tale: [
      ["In the morning, it is sunny.", "Buổi sáng, trời nắng.", "☀️"],
      ["Then big clouds come.", "Rồi những đám mây to kéo đến.", "☁️"],
      ["It rains and rains.", "Trời mưa mãi, mưa mãi.", "🌧️"],
      ["The frogs are very happy.", "Những chú ếch rất vui.", "🐸"],
      ["Then the sun comes back with a rainbow!", "Rồi mặt trời trở lại cùng cầu vồng!", "🌈"]
    ]
  },
  actions: {
    chant: [
      ["I can run, run, run!", "Tớ biết chạy, chạy, chạy!"],
      ["I can jump, jump, jump!", "Tớ biết nhảy, nhảy, nhảy!"],
      ["I can swim, swim, swim!", "Tớ biết bơi, bơi, bơi!"],
      ["I can dance and I can sing!", "Tớ biết múa và tớ biết hát!"],
      ["What can you do? Show me!", "Bạn làm được gì? Cho tớ xem nào!"]
    ],
    talk: [
      ["Can you swim?", "Bạn biết bơi không?", "Yes, I can.", "Có, tớ biết.", "🏊"],
      ["Can you ride a bike?", "Bạn biết đạp xe không?", "No, I can't.", "Không, tớ không biết.", "🚴"],
      ["What can you do?", "Bạn làm được gì?", "I can draw.", "Tớ biết vẽ.", "🎨"]
    ],
    tale: [
      ["Today is Sports Day.", "Hôm nay là ngày hội thể thao.", "🏅"],
      ["Hoa runs very fast.", "Hoa chạy rất nhanh.", "🏃"],
      ["Duc climbs to the top.", "Đức leo lên tận đỉnh.", "🧗"],
      ["Lan sings a song for everyone.", "Lan hát một bài cho mọi người nghe.", "🎤"],
      ["Everybody can do something great!", "Ai cũng làm được điều tuyệt vời!", "🌟"]
    ]
  },
  feelings: {
    chant: [
      ["If you are happy, clap your hands!", "Nếu bạn vui, hãy vỗ tay nào!"],
      ["If you are sad, give a hug.", "Nếu bạn buồn, ôm nhau một cái."],
      ["If you are tired, take a rest.", "Nếu bạn mệt, nghỉ ngơi một chút."],
      ["If you are hungry, have a snack.", "Nếu bạn đói, ăn chút gì nhé."],
      ["How do you feel? Tell me, please!", "Bạn thấy thế nào? Kể tớ nghe với!"]
    ],
    talk: [
      ["How do you feel?", "Bạn cảm thấy thế nào?", "I feel happy.", "Tớ thấy vui.", "😊"],
      ["Are you sad?", "Bạn buồn à?", "No, I am not.", "Không, tớ không buồn.", "🙂"],
      ["Why are you scared?", "Sao bạn sợ thế?", "I see a big dog.", "Tớ thấy một con chó to.", "😨"]
    ],
    tale: [
      ["Minh drops his ice cream. He is sad.", "Minh làm rơi cây kem. Cậu buồn lắm.", "😢"],
      ["His friend An sees him.", "Bạn An nhìn thấy cậu.", "👀"],
      ["An shares her ice cream with Minh.", "An chia kem của mình cho Minh.", "🍦"],
      ["Now Minh is happy.", "Bây giờ Minh đã vui.", "😊"],
      ["Friends make us smile!", "Bạn bè làm chúng ta mỉm cười!", "💛"]
    ]
  },
  wild: {
    chant: [
      ["Deep in the jungle, look and see!", "Sâu trong rừng xanh, nhìn kỹ nào!"],
      ["A lion is roaring at me!", "Một chú sư tử đang gầm với tớ!"],
      ["A monkey is swinging in the tree.", "Một chú khỉ đu trên cây."],
      ["An elephant is splashing, one, two, three!", "Một chú voi té nước, một, hai, ba!"],
      ["Wild animals, big and free!", "Động vật hoang dã, to lớn và tự do!"]
    ],
    talk: [
      ["What animal is it?", "Đây là con vật gì?", "It is a tiger.", "Đó là con hổ.", "🐯"],
      ["What color is the zebra?", "Ngựa vằn có màu gì?", "It is black and white.", "Nó màu đen và trắng.", "🦓"],
      ["Is the giraffe tall?", "Hươu cao cổ có cao không?", "Yes, it is very tall.", "Có, nó rất cao.", "🦒"]
    ],
    tale: [
      ["Nam goes to the zoo with Dad.", "Nam đi sở thú cùng bố.", "🦓"],
      ["First, they see a big elephant.", "Đầu tiên, họ thấy một chú voi to.", "🐘"],
      ["Then, a monkey eats a banana.", "Sau đó, một chú khỉ ăn chuối.", "🐒"],
      ["A penguin walks, waddle, waddle.", "Một chú chim cánh cụt lạch bạch đi.", "🐧"],
      ["Nam says, I love the zoo!", "Nam nói: Con thích sở thú lắm!", "🦁"]
    ]
  },
  places: {
    chant: [
      ["Where are you going? To the park!", "Bạn đi đâu thế? Ra công viên!"],
      ["Where are you going? To the shop!", "Bạn đi đâu thế? Đến cửa hàng!"],
      ["Where are you going? To the beach!", "Bạn đi đâu thế? Ra bãi biển!"],
      ["Where are you going? To the zoo!", "Bạn đi đâu thế? Đến sở thú!"],
      ["Come with me, I'll go with you!", "Đi cùng tớ nhé, tớ đi cùng bạn!"]
    ],
    talk: [
      ["Where are you going?", "Bạn đang đi đâu?", "I am going to the library.", "Tớ đi đến thư viện.", "📚"],
      ["Where do you buy food?", "Bạn mua đồ ăn ở đâu?", "At the supermarket.", "Ở siêu thị.", "🛒"],
      ["Where do doctors work?", "Bác sĩ làm việc ở đâu?", "In the hospital.", "Ở bệnh viện.", "🏥"]
    ],
    tale: [
      ["On Saturday, Lan is busy.", "Thứ Bảy, Lan rất bận.", "📅"],
      ["In the morning, she goes to the library.", "Buổi sáng, bạn ấy đến thư viện.", "📚"],
      ["At noon, she eats lunch at home.", "Buổi trưa, bạn ấy ăn trưa ở nhà.", "🏠"],
      ["In the afternoon, she plays in the park.", "Buổi chiều, bạn ấy chơi ở công viên.", "🏞️"],
      ["At night, she sleeps well. Good night!", "Buổi tối, bạn ấy ngủ ngon. Chúc ngủ ngon!", "🌙"]
    ]
  },
  transport: {
    chant: [
      ["The bus on the road goes beep, beep, beep.", "Xe buýt trên đường kêu bíp, bíp, bíp."],
      ["The plane in the sky goes zoom, zoom, zoom.", "Máy bay trên trời bay vù, vù, vù."],
      ["The boat on the sea goes up and down.", "Con thuyền trên biển lên xuống, lên xuống."],
      ["The train on the track goes choo, choo, choo.", "Tàu hỏa trên đường ray tu, tu, tu."],
      ["Let's go, let's go, all over town!", "Đi thôi, đi thôi, khắp thị trấn nào!"]
    ],
    talk: [
      ["How do you go to school?", "Bạn đi học bằng gì?", "I go by bus.", "Tớ đi bằng xe buýt.", "🚌"],
      ["Can a boat fly?", "Thuyền có bay được không?", "No, it can't.", "Không, nó không bay được.", "⛵"],
      ["What is fast?", "Cái gì đi nhanh?", "A plane is fast.", "Máy bay đi nhanh.", "✈️"]
    ],
    tale: [
      ["Bi and Mum visit Grandma.", "Bi và mẹ đi thăm bà.", "👵"],
      ["First, they take a taxi.", "Đầu tiên, hai mẹ con đi taxi.", "🚕"],
      ["Then, they get on a train.", "Sau đó, họ lên tàu hỏa.", "🚆"],
      ["Then, they ride a boat on the river.", "Rồi họ đi thuyền trên sông.", "⛵"],
      ["Grandma is waiting with a hug!", "Bà đang chờ để ôm hai mẹ con!", "🤗"]
    ]
  },
  num20: {
    chant: [
      ["Ten, eleven, twelve, let's go!", "Mười, mười một, mười hai, đi nào!"],
      ["Thirteen, fourteen, fifteen, slow.", "Mười ba, mười bốn, mười lăm, chậm thôi."],
      ["Sixteen, seventeen, jump up high!", "Mười sáu, mười bảy, nhảy thật cao!"],
      ["Eighteen, nineteen, touch the sky!", "Mười tám, mười chín, chạm bầu trời!"],
      ["Twenty, twenty, wave goodbye!", "Hai mươi, hai mươi, vẫy tay chào!"]
    ],
    talk: [
      ["How many crayons do you have?", "Bạn có bao nhiêu bút sáp màu?", "I have twelve.", "Tớ có mười hai cái.", "🖍️"],
      ["What number is it?", "Đây là số mấy?", "It is fifteen.", "Đó là số mười lăm.", "🔢"],
      ["How many students are in your class?", "Lớp bạn có bao nhiêu học sinh?", "Twenty students.", "Hai mươi học sinh.", "🏫"]
    ],
    tale: [
      ["Ms. Hoa takes the class to a farm.", "Cô Hoa đưa cả lớp đi nông trại.", "🚜"],
      ["They count eleven ducks.", "Các bạn đếm được mười một con vịt.", "🦆"],
      ["They count fourteen cows.", "Các bạn đếm được mười bốn con bò.", "🐮"],
      ["They pick twenty red tomatoes.", "Các bạn hái hai mươi quả cà chua đỏ.", "🍅"],
      ["What a fun day at the farm!", "Một ngày ở nông trại thật vui!", "🌻"]
    ]
  },
  days: {
    chant: [
      ["Monday, Tuesday, go to school.", "Thứ Hai, thứ Ba, đi học nào."],
      ["Wednesday, Thursday, learn and play.", "Thứ Tư, thứ Năm, học và chơi."],
      ["Friday is a happy day.", "Thứ Sáu là một ngày vui."],
      ["Saturday, Sunday, stay at home.", "Thứ Bảy, Chủ nhật, ở nhà thôi."],
      ["Seven days in every week!", "Mỗi tuần có bảy ngày!"]
    ],
    talk: [
      ["What day is it today?", "Hôm nay là thứ mấy?", "It is Tuesday.", "Hôm nay là thứ Ba.", "📅"],
      ["When do you have English?", "Bạn học tiếng Anh vào hôm nào?", "On Monday and Thursday.", "Vào thứ Hai và thứ Năm.", "📘"],
      ["What do you do on Sunday?", "Chủ nhật bạn làm gì?", "I go swimming.", "Tớ đi bơi.", "🏊"]
    ],
    tale: [
      ["On Monday, Tim plants a seed.", "Thứ Hai, Tim gieo một hạt giống.", "🌱"],
      ["On Tuesday, he gives it water.", "Thứ Ba, cậu tưới nước cho hạt.", "💧"],
      ["On Wednesday, the sun shines on it.", "Thứ Tư, mặt trời chiếu nắng lên.", "☀️"],
      ["On Friday, he sees a little leaf.", "Thứ Sáu, cậu thấy một chiếc lá non.", "🍃"],
      ["On Sunday, there is a flower!", "Chủ nhật, đã có một bông hoa!", "🌻"]
    ]
  },
  jobs: {
    chant: [
      ["A doctor helps us when we are sick.", "Bác sĩ giúp ta khi bị ốm."],
      ["A farmer grows rice, quick, quick, quick.", "Nông dân trồng lúa, nhanh, nhanh, nhanh."],
      ["A teacher helps us read and write.", "Thầy cô giúp ta đọc và viết."],
      ["A pilot flies the plane at night.", "Phi công lái máy bay trong đêm."],
      ["What do you want to be? Tell me!", "Bạn muốn làm nghề gì? Kể tớ nghe!"]
    ],
    talk: [
      ["What does your father do?", "Bố bạn làm nghề gì?", "He is a doctor.", "Bố tớ là bác sĩ.", "👨‍⚕️"],
      ["What do you want to be?", "Bạn muốn làm nghề gì?", "I want to be a teacher.", "Tớ muốn làm giáo viên.", "👩‍🏫"],
      ["Where does a cook work?", "Đầu bếp làm việc ở đâu?", "In a kitchen.", "Trong nhà bếp.", "👨‍🍳"]
    ],
    tale: [
      ["There is a fire in a tall building!", "Có một đám cháy ở tòa nhà cao tầng!", "🔥"],
      ["The firefighters come very fast.", "Lính cứu hỏa đến rất nhanh.", "🚒"],
      ["They put out the fire with water.", "Họ dập lửa bằng nước.", "💧"],
      ["A nurse helps a little boy.", "Một cô y tá giúp đỡ một cậu bé.", "👩‍⚕️"],
      ["Everyone is safe. Thank you, heroes!", "Mọi người đều an toàn. Cảm ơn các người hùng!", "🦸"]
    ]
  },
  routine: {
    chant: [
      ["Get up, get up, it's seven o'clock!", "Dậy thôi, dậy thôi, bảy giờ rồi!"],
      ["Brush your teeth, tick tock, tick tock.", "Đánh răng nào, tích tắc, tích tắc."],
      ["Have your breakfast, then go to school.", "Ăn sáng xong, rồi đến trường."],
      ["Do your homework, that is the rule.", "Làm bài tập về nhà, đó là nếp quen."],
      ["Take a shower, go to bed. Good night!", "Đi tắm rồi đi ngủ. Chúc ngủ ngon!"]
    ],
    talk: [
      ["What time do you get up?", "Bạn thức dậy lúc mấy giờ?", "I get up at six o'clock.", "Tớ dậy lúc sáu giờ.", "⏰"],
      ["What do you do after school?", "Sau giờ học bạn làm gì?", "I do my homework.", "Tớ làm bài tập.", "📝"],
      ["What time do you go to bed?", "Bạn đi ngủ lúc mấy giờ?", "At nine o'clock.", "Lúc chín giờ.", "🛏️"]
    ],
    tale: [
      ["Mia is a sleepy girl.", "Mia là một cô bé hay buồn ngủ.", "😴"],
      ["Her clock rings at six o'clock.", "Đồng hồ của bạn ấy reo lúc sáu giờ.", "⏰"],
      ["Mia says, Five more minutes!", "Mia nói: Thêm năm phút nữa thôi!", "🛏️"],
      ["Oh no! It is seven o'clock. She is late!", "Ôi không! Bảy giờ rồi. Bạn ấy muộn mất!", "🏃"],
      ["Now Mia goes to bed early every night.", "Giờ tối nào Mia cũng đi ngủ sớm.", "🌙"]
    ]
  },
  sports: {
    chant: [
      ["Kick the ball, kick, kick, kick!", "Sút bóng nào, sút, sút, sút!"],
      ["Throw the ball, quick, quick, quick!", "Ném bóng đi, nhanh, nhanh, nhanh!"],
      ["Hit the shuttle, up so high!", "Đánh quả cầu bay thật cao!"],
      ["Swim like a fish, splash, splash, splash!", "Bơi như cá, tõm, tõm, tõm!"],
      ["Sports are fun, let's play today!", "Thể thao vui lắm, chơi ngay hôm nay!"]
    ],
    talk: [
      ["What sport do you like?", "Bạn thích môn thể thao nào?", "I like badminton.", "Tớ thích cầu lông.", "🏸"],
      ["Do you play football?", "Bạn có chơi bóng đá không?", "Yes, every Saturday.", "Có, mỗi thứ Bảy.", "⚽"],
      ["What is your hobby?", "Sở thích của bạn là gì?", "My hobby is painting.", "Sở thích của tớ là vẽ tranh.", "🎨"]
    ],
    tale: [
      ["Our class plays a football game.", "Lớp tớ chơi một trận bóng đá.", "⚽"],
      ["Khoa kicks the ball hard.", "Khoa sút bóng thật mạnh.", "🦵"],
      ["Goal! Everybody shouts and claps.", "Vào! Mọi người reo hò và vỗ tay.", "👏"],
      ["We do not win, but we have fun.", "Chúng tớ không thắng, nhưng rất vui.", "😄"],
      ["We shake hands with the other team.", "Chúng tớ bắt tay đội bạn.", "🤝"]
    ]
  },
  sea: {
    chant: [
      ["Down in the sea, what can you see?", "Dưới biển sâu, bạn thấy gì nào?"],
      ["A big whale swimming next to me.", "Một chú cá voi to bơi cạnh tớ."],
      ["A little crab walking side to side.", "Một chú cua nhỏ bò ngang, bò ngang."],
      ["An octopus waving eight arms wide.", "Một chú bạch tuộc vẫy tám xúc tu."],
      ["Splash, splash, what a ride!", "Tõm, tõm, chuyến đi thật vui!"]
    ],
    talk: [
      ["Where do fish live?", "Cá sống ở đâu?", "They live in the water.", "Chúng sống dưới nước.", "🐟"],
      ["How many legs does an octopus have?", "Bạch tuộc có mấy chân?", "It has eight legs.", "Nó có tám chân.", "🐙"],
      ["Is the shark big?", "Cá mập có to không?", "Yes, it is very big.", "Có, nó rất to.", "🦈"]
    ],
    tale: [
      ["Little Turtle wants to see the sea.", "Rùa con muốn đi ngắm biển.", "🐢"],
      ["She meets a friendly dolphin.", "Rùa gặp một bạn cá heo thân thiện.", "🐬"],
      ["She sees a crab on the sand.", "Rùa thấy một chú cua trên cát.", "🦀"],
      ["She finds a pretty shell.", "Rùa tìm thấy một chiếc vỏ sò xinh xắn.", "🐚"],
      ["The sea is big and beautiful!", "Biển thật rộng lớn và tuyệt đẹp!", "🌊"]
    ]
  },
  veg: {
    chant: [
      ["Carrots are orange, crunch, crunch, crunch.", "Cà rốt màu cam, giòn, giòn, giòn."],
      ["Tomatoes are red, good for lunch.", "Cà chua màu đỏ, ngon bữa trưa."],
      ["Corn is yellow, sweet and bright.", "Ngô màu vàng, ngọt và tươi."],
      ["Broccoli is green, take a bite!", "Súp lơ màu xanh, cắn một miếng nào!"],
      ["Eat your vegetables every day!", "Ăn rau củ mỗi ngày nhé!"]
    ],
    talk: [
      ["Do you like carrots?", "Bạn có thích cà rốt không?", "Yes, I like carrots.", "Có, tớ thích cà rốt.", "🥕"],
      ["What color is the corn?", "Bắp ngô màu gì?", "It is yellow.", "Nó màu vàng.", "🌽"],
      ["Are vegetables good for you?", "Rau củ có tốt cho bạn không?", "Yes, they are.", "Có, rất tốt.", "🥦"]
    ],
    tale: [
      ["Grandma has a little garden.", "Bà có một khu vườn nhỏ.", "👵"],
      ["Na helps her pick the tomatoes.", "Na giúp bà hái cà chua.", "🍅"],
      ["They pull a big carrot. Pull, pull!", "Hai bà cháu nhổ một củ cà rốt to. Kéo, kéo!", "🥕"],
      ["They find a potato in the soil.", "Hai bà cháu tìm thấy một củ khoai tây trong đất.", "🥔"],
      ["Grandma cooks a yummy soup.", "Bà nấu một nồi canh thật ngon.", "🍲"]
    ]
  },
  opposites: {
    chant: [
      ["Big and small, big and small.", "To và nhỏ, to và nhỏ."],
      ["Fast and slow, fast and slow.", "Nhanh và chậm, nhanh và chậm."],
      ["Hot and cold, hot and cold.", "Nóng và lạnh, nóng và lạnh."],
      ["Tall and short, stand up tall!", "Cao và thấp, đứng thẳng lên nào!"],
      ["Opposites, opposites, learn them all!", "Từ trái nghĩa, học hết nào!"]
    ],
    talk: [
      ["Is the mouse big?", "Con chuột có to không?", "No, it is small.", "Không, nó nhỏ.", "🐭"],
      ["Is the turtle fast?", "Con rùa có nhanh không?", "No, it is slow.", "Không, nó chậm.", "🐢"],
      ["Is the ice hot?", "Đá có nóng không?", "No, it is cold.", "Không, nó lạnh.", "🧊"]
    ],
    tale: [
      ["The rabbit is fast. The turtle is slow.", "Thỏ thì nhanh. Rùa thì chậm.", "🐰"],
      ["They have a race.", "Hai bạn chạy thi.", "🏁"],
      ["The rabbit stops and sleeps under a tree.", "Thỏ dừng lại và ngủ dưới gốc cây.", "😴"],
      ["The turtle walks and walks.", "Rùa cứ đi, đi mãi.", "🐢"],
      ["The slow turtle wins the race!", "Rùa chậm chạp đã thắng cuộc đua!", "🏆"]
    ]
  },
  seasons: {
    chant: [
      ["Spring has flowers, pink and new.", "Mùa xuân có hoa, hồng và tươi."],
      ["Summer is hot, the sky is blue.", "Mùa hè nóng, trời xanh trong."],
      ["Autumn leaves fall down, down, down.", "Mùa thu lá rơi, rơi, rơi."],
      ["Winter is cold, snow on the ground.", "Mùa đông lạnh, tuyết phủ mặt đất."],
      ["Four seasons go round and round!", "Bốn mùa cứ thế quay vòng!"]
    ],
    talk: [
      ["Which season do you like?", "Bạn thích mùa nào?", "I like summer.", "Tớ thích mùa hè.", "🏖️"],
      ["What's the weather like in winter?", "Mùa đông thời tiết thế nào?", "It is cold.", "Trời lạnh.", "⛄"],
      ["What do you do in spring?", "Mùa xuân bạn làm gì?", "I fly a kite.", "Tớ thả diều.", "🪁"]
    ],
    tale: [
      ["In spring, a little tree has new leaves.", "Mùa xuân, cây non ra lá mới.", "🌱"],
      ["In summer, children play under the tree.", "Mùa hè, các bạn nhỏ chơi dưới gốc cây.", "☀️"],
      ["In autumn, the leaves turn orange.", "Mùa thu, lá chuyển sang màu cam.", "🍂"],
      ["In winter, the tree sleeps in the snow.", "Mùa đông, cây ngủ trong tuyết.", "❄️"],
      ["Then spring comes again!", "Rồi mùa xuân lại đến!", "🌸"]
    ]
  },
  now: {
    chant: [
      ["What are you doing? I am reading.", "Bạn đang làm gì? Tớ đang đọc sách."],
      ["What are you doing? I am eating.", "Bạn đang làm gì? Tớ đang ăn."],
      ["What are you doing? I am singing.", "Bạn đang làm gì? Tớ đang hát."],
      ["What are you doing? I am drawing.", "Bạn đang làm gì? Tớ đang vẽ."],
      ["Busy, busy, all day long!", "Bận rộn, bận rộn, suốt cả ngày!"]
    ],
    talk: [
      ["What are you doing?", "Bạn đang làm gì thế?", "I am drawing a cat.", "Tớ đang vẽ một con mèo.", "🎨"],
      ["What is Dad doing?", "Bố đang làm gì?", "He is cooking.", "Bố đang nấu ăn.", "👨‍🍳"],
      ["Is the baby sleeping?", "Em bé đang ngủ à?", "Yes, she is.", "Đúng vậy.", "😴"]
    ],
    tale: [
      ["It is a busy evening at home.", "Một buổi tối bận rộn ở nhà.", "🏠"],
      ["Mum is cooking dinner.", "Mẹ đang nấu bữa tối.", "🍲"],
      ["Dad is reading the news.", "Bố đang đọc tin tức.", "📰"],
      ["My sister is playing the piano.", "Chị tớ đang chơi đàn piano.", "🎹"],
      ["And I am doing my homework!", "Còn tớ đang làm bài tập!", "📝"]
    ]
  }
};
