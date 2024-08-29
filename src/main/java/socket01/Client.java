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
            Socket socket = new Socket("192.168.0.56", 9000); // host: 주소값 / port: 서버포트

            // 1. 입력
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            // 2. 출력
            PrintWriter printWriter = new PrintWriter(socket.getOutputStream(), true);

            System.out.println("=> 서버 연결 <=");
            Scanner scanner = new Scanner(System.in);

            while (true) {
                String message = scanner.nextLine();

                System.out.println("=> 서버 메세지: " + message); // 전송한 메세지 출력
                printWriter.println(message);

                String result = bufferedReader.readLine();
                System.out.println("=> 서버 응답: " + result); // 서버 응답 메세지 출력
            }

        } catch (IOException e) { // 예외처리 필수
//            throw new RuntimeException(e);
            System.out.println("클라이언트 접속 종료");
        }
    }
}
