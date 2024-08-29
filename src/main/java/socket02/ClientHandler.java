package socket02;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

public class ClientHandler implements Runnable{

    private Socket socket;

    public ClientHandler(Socket socket) {
        this.socket = socket;
    }

    @Override
    public void run() {
        try {
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);

            String msg;
            while((msg = in.readLine()) != null) {
                System.out.println("클라이언트 대화글 : " + msg);
                out.println("서버에 전송 받은 글 :" + msg);
            }
        } catch (IOException e) {
//			e.printStackTrace();
            System.out.println("클라이언트가 접속을 종료 하였습니다.");
        } finally {
            try {
                socket.close();
            } catch (IOException e) {
//				e.printStackTrace();
            }
        }
        System.out.println("연결 종료 되었습니다.");
    }
}
