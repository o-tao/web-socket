package file;

import java.io.*;
import java.util.Scanner;

public class Note {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String txt = scanner.nextLine();
        out(txt); // 입력받은 txt 입력(저장)

        in(); // 입력받은 txt 가져오기(읽기)

    }

    public static void in() { // 대상 파일의 내용을 읽어오는 메서드
        try {
//            FileInputStream fileInputStream = new FileInputStream("src/text.txt");
//            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);
//            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            // 위의 3줄 한줄 처리
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(new FileInputStream("src/text.txt")));

            int value = 0;
            while ((value = bufferedReader.read()) != -1) {
                System.out.print( (char) value);

            }
            bufferedReader.close();

        } catch (FileNotFoundException e) { // FileInputStream 예외처리
            throw new RuntimeException(e);

        } catch (IOException e) { // bufferedWriter.write 예외처리
            throw new RuntimeException(e);
        }

    }

    public static void out(String txt) { // 대상 파일의 내용을 입력하는 메서드
        System.out.println("입력 내용: " + txt);
        try {
//            FileOutputStream fileOutputStream = new FileOutputStream("src/text.txt", false);// false: 매번 새롭게 받음, true: 이어서 받음
//            OutputStreamWriter outputStreamWriter = new OutputStreamWriter(fileOutputStream, "UTF-8");
//            BufferedWriter bufferedWriter = new BufferedWriter(outputStreamWriter);

            // 위의 3줄 한줄 처리
            BufferedWriter bufferedWriter = new BufferedWriter(new OutputStreamWriter(new FileOutputStream("src/text.txt", true), "UTF-8"));
            bufferedWriter.write(txt);
            bufferedWriter.write("\n");
            bufferedWriter.close();

        } catch (FileNotFoundException e) { // FileOutputStream 예외처리
            throw new RuntimeException(e);

        } catch (UnsupportedEncodingException e) { // OutputStreamWriter 예외처리
            throw new RuntimeException(e);

        } catch (IOException e) { // bufferedWriter.write 예외처리
            throw new RuntimeException(e);
        }
    }

}
