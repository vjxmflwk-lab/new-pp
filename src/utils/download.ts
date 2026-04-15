// 이미지 저장 기능
export const downloadImage = async (url: string, fileName: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob(); // 이미지를 바이너리 데이터로 변환
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName || "download-image"; // 다운로드될 파일명
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 메모리 누수 방지
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("다운로드 중 오류 발생:", error);
    alert("이미지 다운로드에 실패했습니다.");
  }
};

export const downloadAllImages = async (
  mediaList: { mediaUrl: string }[],
  postId: string,
) => {
  // 모든 다운로드 프로미스를 생성
  const downloadPromises = mediaList.map((media, index) => {
    const fileName = `jaeyi_${postId}_${index + 1}.jpg`;
    return downloadImage(media.mediaUrl, fileName);
  });

  // 한 번에 실행
  try {
    await Promise.all(downloadPromises);
  } catch (error) {
    console.error("일괄 다운로드 중 오류:", error);
    alert("일부 이미지 다운로드에 실패했습니다.");
  }
};
