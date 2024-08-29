package socket01;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Scanner;

public class Client {

    public static void main(String[] args) {
        // 소켓 서버를 실행해야 접속하여 사용 가능
        try {
            Socket socket = new Socket("192.168.0.9", 9000); // host: 주소값 / port: 서버포트

            // 1. 입력
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            // 2. 출력
            PrintWriter printWriter = new PrintWriter(socket.getOutputStream(), true);

            System.out.println("=> 서버 연결 <=");
            Scanner scanner = new Scanner(System.in);

            // 별도의 스레드에서 서버로부터의 메시지를 읽어와서 출력
            Thread readThread = new Thread(() -> {
                String response;
                try {
                    while ((response = bufferedReader.readLine()) != null) {
                        System.out.println("=> 서버 응답: " + response); // 서버 응답을 콘솔에 출력
                    }
                } catch (IOException e) {
                    System.out.println("서버와의 통신 오류");
                }
            });
            readThread.start();

            // 클라이언트로부터의 입력을 서버로 전송
            while (true) {
                String message = scanner.nextLine();
                System.out.println("=> 클라이언트 메세지: " + message); // 전송한 메세지 출력
                printWriter.println(message);
            }

        } catch (IOException e) { // 예외처리 필수
//            throw new RuntimeException(e);
            System.out.println("클라이언트 접속 종료");
        }
    }
}
