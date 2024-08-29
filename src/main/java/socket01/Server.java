package socket01;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

public class Server {

    public static void main(String[] args) {
        // 소켓 통신 서버용으로 필수적으로 실행해야 사용자가 사용 가능
        try {
            ServerSocket serverSocket = new ServerSocket(9000);
            System.out.println("=> Socket Server Start <=");

            while (true) {
                Socket socket = serverSocket.accept(); // 소켓 서버 접속 허용 처리
                OutputStream outputStream = socket.getOutputStream();

                // 1. 입력
                BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                // 2. 출력
                PrintWriter printWriter = new PrintWriter(outputStream, true);

                System.out.println("=> Client Connected <=");

//                String message = bufferedReader.readLine();

                // 지속적인 메세지 전달
                String message;
                while ((message = bufferedReader.readLine()) != null) {
                    System.out.println("=> Client Message: " + message); // Client에서 전달 한 메세지 출력
                    printWriter.println("=> Server Message: " + message); // Client로 메세지 전달
                }

            }

        } catch (IOException e) { // 예외처리 필수
            throw new RuntimeException(e);
        }
    }
}

/******************************===== main 메서드 1, 2번 실행과정 =====******************************
 * 1. 입력                                                                                      *
 * InputStream inputStream = socket.getInputStream();// Client에서 오는 입력을 받는 객체             *
 * InputStreamReader inputStreamReader = new InputStreamReader(inputStream); // 읽는 행위        *
 * BufferedReader bufferedReader = new BufferedReader(inputStreamReader);                      *
 *                                                                                             *
 * 2. 출력                                                                                      *
 * PrintWriter printWriter = new PrintWriter(outputStream, true);                              *
 ***********************************************************************************************/