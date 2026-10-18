"use client";

import React, { useState, useRef } from "react";

// --- 카카오톡 메시지 데이터 (2026년 날짜 지정) ---
const CHAT_MESSAGES = [
  // JULY 4, 2026
  { id: "m1", dateHeader: "2026년 7월 4일" },
  { id: "m1_msg", sender: "JUJU", text: "아까 비행기에서 번호 주셨던 승무원인데요. 확인 후 연락 주세요." },
  { id: "m2_msg", sender: "JUJU", text: "종일 신경 쓰이게 만들더니, 연락처만 먹고 버리겠다?" },
  { id: "m3_msg", sender: "JUJU", text: "지금 사람 가지고 놀아요?" },

  // JULY 25, 2026
  { id: "m2_date", dateHeader: "2026년 7월 25일" },
  { id: "m4_msg", sender: "me", text: "주주, 나 오늘 촬영 끝났어요. 피곤해 죽을 거 같아 ㅠㅠ" },
  { id: "m5_msg", sender: "JUJU", text: "피곤하면 잠자요" },
  { id: "m6_msg", sender: "me", text: "아까 길 가다가 주주 닮은 강아지 봤어요. 사진 볼래요?", image: "ncej 38.JPG" },
  { id: "m7_msg", sender: "JUJU", text: "치와와?" },

  // AUGUST 15, 2026
  { id: "m3_date", dateHeader: "2026년 8월 15일" },
  { id: "m8_msg", sender: "me", text: "오늘 비 오는데, 밥은 먹었어요?", image: "ncej 40.JPG" },
  { id: "m9_msg", sender: "JUJU", text: "우동 먹었어요." },
  { id: "m10_msg", sender: "me", text: "주주, 나 오늘 안무 연습하다가 발목 삐끗했는데\n의주가 와서 호- 해줘야 하는 거 아니야?\n😭😭" },

  // AUGUST 22, 2026
  { id: "m4_date", dateHeader: "2026년 8월 22일" },
  { id: "m11_msg", sender: "me", time: "오전 11:18", text: "주주 나 방금 리허설 끝났어!\n목에 의주가 남겨둔 자국 때문에 메이크업 누나가 놀라서 컨실러로 겨우 가려줬어 ㅋㅋ\n의주 은근히 소유욕 있는 타입?" },
  { id: "m12_msg", sender: "JUJU", text: "ㅡㅡ\n그런 거 아니거든" },
  { id: "m13_msg", sender: "me", text: "ㅡㅡ\n그런 거 아니거든" },

  // AUGUST 23, 2026
  { id: "m5_date", dateHeader: "2026년 8월 23일" },
  { id: "m14_msg", sender: "me", time: "오후 2:20", text: "비행 잘 다녀왔어?\n보고 싶어\n당장 서울 가는 비행기 타고 날아가고 싶다… 😢" },
  { id: "m15_msg", sender: "JUJU", text: "나도 보고 싶어 니콜" },
  { id: "m16_msg", sender: "me", text: "내가 얼른 갈게\n나도 보고 싶내가 얼른 갈게" },

  // AUGUST 24, 2026
  { id: "m6_date", dateHeader: "2026년 8월 24일" },
  { id: "m17_msg", sender: "me", time: "오전 7:16", text: "얼른 가서 의주 안고 싶은데 그럴 수가 없네\n미안해\n빨리 스케줄 끝내고 갈게. 진짜 너무 미안해" },
  { id: "m18_msg", sender: "JUJU", text: "자꾸 미안하다고 안 해도 돼\n대신 서울 도착하면 제일 먼저 안아 줘" },
  { id: "m19_msg", sender: "me", text: "자꾸 미안하다고 안 해도 돼\n대신 서울 도착하면 제일 먼저 안아 줘" },
  { id: "m20_msg", sender: "me", text: "Of course\n의주 만족할 때까지 얼마든지 ㅎㅎ" },
  { id: "m21_msg", sender: "JUJU", text: "그런 의미로 말한 거 아니거든 ㅡㅡ??" },
  { id: "m22_msg", sender: "me", text: "그런 의미로 말한 거 아니거든 ㅡㅡ??" },
  { id: "m23_msg", sender: "me", text: "🥲" },

  // AUGUST 27, 2026
  { id: "m7_date", dateHeader: "2026년 8월 27일" },
  { id: "m24_msg", sender: "me", image: "img_3133.jpg" },
  { id: "m25_msg", sender: "me", text: "주주야, 나 방금 호텔 들어왔어\n보고 싶어 😢\n의주는 지금 뭐 하고 있어?" },
  { id: "m26_msg", sender: "JUJU", text: "고생했네\n나? 이제 씻고 자야지." },
  { id: "m27_msg", sender: "me", image: "ncej36.JPG" },
  { id: "m28_msg", sender: "me", text: "니콜도 굿나잇" },
];

export default function iPhoneApp() {
  const [screen, setScreen] = useState<"lock" | "home" | "photos" | "kakaoList" | "kakaoChat">("lock");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // 드래그 잠금 해제 제스처
  const [startY, setStartY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setStartY(clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (startY === null) return;
    const clientY = "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;
    if (startY - clientY > 80) {
      setScreen("home"); // 위로 80px 이상 스와이프 시 잠금해제
    }
    setStartY(null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 font-sans select-none">
      {/* 스마트폰 프레임 */}
      <div 
        className="relative w-[375px] h-[812px] bg-black rounded-[50px] border-[12px] border-gray-800 shadow-2xl overflow-hidden text-white flex flex-col"
        onMouseDown={screen === "lock" ? handleTouchStart : undefined}
        onMouseUp={screen === "lock" ? handleTouchEnd : undefined}
        onTouchStart={screen === "lock" ? handleTouchStart : undefined}
        onTouchEnd={screen === "lock" ? handleTouchEnd : undefined}
      >
        {/* 상단 다이나믹 아일랜드 / 노치 */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50"></div>

        {/* --- 1. 잠금 화면 --- */}
        {screen === "lock" && (
          <div className="relative w-full h-full flex flex-col justify-between p-6 bg-cover bg-center" style={{ backgroundImage: "url('/IMG_3087.JPG')" }}>
            <div className="mt-12 text-center drop-shadow-md">
              <div className="text-xl font-medium">10월 19일 월요일</div>
              <div className="text-7xl font-bold tracking-tight">04:43</div>
            </div>

            {/* 알림 카드 */}
            <div className="flex flex-col gap-3 mb-10 z-10">
              <div className="bg-white/30 backdrop-blur-md rounded-2xl p-3.5 text-black text-sm shadow">
                <div className="flex justify-between text-xs text-gray-700 font-semibold mb-1">
                  <span>전화</span>
                  <span>방금 전</span>
                </div>
                <div className="font-bold">JUJU</div>
                <div className="text-xs text-gray-800">부재중 전화 2통</div>
              </div>

              <div className="bg-white/30 backdrop-blur-md rounded-2xl p-3.5 text-black text-sm shadow">
                <div className="flex justify-between text-xs text-gray-700 font-semibold mb-1">
                  <span>메시지</span>
                  <span>방금 전</span>
                </div>
                <div className="font-bold">JUJU</div>
                <div className="text-xs text-gray-800">보고싶어 니콜</div>
              </div>
            </div>

            <div className="text-center text-xs text-white/80 animate-bounce mb-2">
              위로 쓸어올려서 열기
            </div>
          </div>
        )}

        {/* --- 2. 홈 화면 --- */}
        {screen === "home" && (
          <div className="relative w-full h-full p-6 bg-cover bg-center flex flex-col justify-between" style={{ backgroundImage: "url('/IMG_3087.JPG')" }}>
            {/* 앱 아이콘 그리드 */}
            <div className="grid grid-cols-4 gap-4 mt-12 text-center text-xs text-white font-medium">
              <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow">✈️</div>
                <span>대한항공</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-2xl shadow">▶️</div>
                <span>YouTube</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-red-500 font-bold text-xl shadow">22</div>
                <span>캘린더</span>
              </div>
              <div 
                className="flex flex-col items-center gap-1 cursor-pointer"
                onClick={() => setScreen("photos")}
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow">🖼️</div>
                <span>사진</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 bg-black rounded-2xl border border-gray-700 flex items-center justify-center text-2xl shadow">⏰</div>
                <span>시계</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center text-2xl shadow">📝</div>
                <span>메모</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow">📷</div>
                <span>Instagram</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-2xl shadow">🌐</div>
                <span>Google 번역</span>
              </div>
            </div>

            {/* 독 (Dock) */}
            <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-3 grid grid-cols-4 gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-2xl m-auto shadow">📞</div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl m-auto shadow">🧭</div>
              <div className="w-12 h-12 bg-green-400 rounded-2xl flex items-center justify-center text-2xl m-auto shadow">💬</div>
              <div 
                className="w-12 h-12 bg-yellow-300 rounded-2xl flex items-center justify-center text-2xl m-auto shadow cursor-pointer"
                onClick={() => setScreen("kakaoList")}
              >
                💬
              </div>
            </div>
          </div>
        )}

        {/* --- 3. 사진 앱 --- */}
        {screen === "photos" && (
          <div className="w-full h-full bg-white text-black flex flex-col pt-10">
            <div className="p-4 border-b flex justify-between items-center">
              <button onClick={() => setScreen("home")} className="text-blue-500 font-medium">← 홈</button>
              <h1 className="font-bold">보관함</h1>
              <div className="w-8"></div>
            </div>

            {selectedPhoto ? (
              <div className="flex-1 bg-black flex flex-col justify-between items-center p-4">
                <img src={`/${selectedPhoto}`} alt="Original" className="max-h-[80%] object-contain my-auto" />
                <button onClick={() => setSelectedPhoto(null)} className="text-white bg-gray-800 px-4 py-2 rounded-full mb-4">목록으로 돌아가기</button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-1 grid grid-cols-3 gap-1">
                {Array.from({ length: 17 }).map((_, i) => {
                  const fileName = `ncej ${i + 1}.JPG`;
                  return (
                    <div 
                      key={i} 
                      className="aspect-square bg-gray-200 overflow-hidden cursor-pointer"
                      onClick={() => setSelectedPhoto(fileName)}
                    >
                      <img src={`/${fileName}`} alt={`ncej ${i+1}`} className="w-full h-full object-cover" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- 4. 카카오톡 채팅 목록 --- */}
        {screen === "kakaoList" && (
          <div className="w-full h-full bg-white text-black flex flex-col pt-10">
            <div className="p-4 flex justify-between items-center border-b">
              <button onClick={() => setScreen("home")} className="text-sm font-medium">← 홈</button>
              <h1 className="font-bold text-lg">채팅</h1>
              <div className="w-8"></div>
            </div>

            <div 
              className="p-4 flex items-center gap-3 hover:bg-gray-50 cursor-pointer border-b"
              onClick={() => setScreen("kakaoChat")}
            >
              <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center font-bold text-white text-xl">
                J
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">JUJU</span>
                  <span className="text-xs text-gray-400">8월 27일</span>
                </div>
                <div className="text-xs text-gray-500 truncate mt-0.5">
                  니콜도 굿나잇
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 5. 카카오톡 대화방 (JUJU) --- */}
        {screen === "kakaoChat" && (
          <div className="w-full h-full bg-[#abc1d1] text-black flex flex-col pt-10">
            <div className="p-3 bg-[#abc1d1] flex justify-between items-center border-b border-black/10">
              <button onClick={() => setScreen("kakaoList")} className="text-sm font-semibold">← 목록</button>
              <h1 className="font-bold">JUJU</h1>
              <div className="w-8"></div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {CHAT_MESSAGES.map((item) => {
                if (item.dateHeader) {
                  return (
                    <div key={item.id} className="text-center my-3">
                      <span className="bg-black/20 text-white text-[10px] px-3 py-1 rounded-full">
                        {item.dateHeader}
                      </span>
                    </div>
                  );
                }

                const isJuju = item.sender === "JUJU";

                return (
                  <div key={item.id} className={`flex gap-2 ${isJuju ? "justify-start" : "justify-end"}`}>
                    {isJuju && (
                      <div className="w-8 h-8 bg-yellow-400 rounded-xl flex items-center justify-center font-bold text-white text-xs">
                        J
                      </div>
                    )}
                    <div className={`flex flex-col ${isJuju ? "items-start" : "items-end"}`}>
                      {isJuju && <span className="text-[11px] text-gray-600 mb-0.5">JUJU</span>}
                      <div className="flex items-end gap-1">
                        {!isJuju && item.time && <span className="text-[9px] text-gray-600">{item.time}</span>}
                        <div className={`p-2.5 rounded-2xl max-w-[200px] text-xs leading-relaxed whitespace-pre-wrap ${
                          isJuju ? "bg-white text-black rounded-tl-none" : "bg-yellow-300 text-black rounded-tr-none"
                        }`}>
                          {item.text}
                          {item.image && (
                            <img src={`/${item.image}`} alt="attachment" className="rounded-lg mt-1 max-w-full" />
                          )}
                        </div>
                        {isJuju && item.time && <span className="text-[9px] text-gray-600">{item.time}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
