"use client";

import { useEffect } from "react";
import { Drawer } from "vaul";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, children }: Props) {
  useEffect(() => {
    if (isOpen) {
      // 1. 시트가 열릴 때 현재 상태를 히스토리에 푸시!
      // URL은 그대로지만 히스토리에 한 칸이 더 생깁니다 ㅋ
      window.history.pushState({ bottomSheet: "open" }, "");

      // 2. 뒤로가기(popstate) 이벤트 감지
      const handlePopState = () => {
        if (isOpen) {
          onClose(); // 뒤로가기 누르면 시트 닫기 함수 호출 ㅋ
        }
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [isOpen, onClose]);

  // 시트가 닫힐 때(성공 후 닫기 등) 히스토리가 꼬이지 않게 처리
  useEffect(() => {
    if (!isOpen && window.history.state?.bottomSheet === "open") {
      window.history.back(); // 수동으로 닫았을 때 히스토리 한 칸 비워주기 ㅋ
    }
  }, [isOpen]);

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[10000]" />
        <Drawer.Content
          className="bg-white flex flex-col rounded-t-[32px] h-fit max-h-[94vh] fixed bottom-0 left-0 right-0 z-[10001] outline-none"
          onOpenAutoFocus={(e) => e.preventDefault()} // 열릴 때 포커스 강제 이동 방지
          onCloseAutoFocus={(e) => e.preventDefault()} // 닫힐 때 원래 위치로 돌아가는 동작 방지
        >
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 my-4" />
          <Drawer.Title className="sr-only ">게시물 업로드</Drawer.Title>
          <Drawer.Description className="sr-only">
            사진을 선택하고 설명을 입력하여 게시물을 등록하세요.
          </Drawer.Description>
          <div className="flex-1 overflow-y-auto p-4 pt-0">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
