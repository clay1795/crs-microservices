package vn.edu.crs.authservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import vn.edu.crs.authservice.entity.Student;
import vn.edu.crs.authservice.entity.User;
import vn.edu.crs.authservice.repository.StudentRepository;
import vn.edu.crs.authservice.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
        }

        User student = userRepository.findByUsername("student1").orElseGet(() -> {
            User user = new User();
            user.setUsername("student1");
            user.setPassword(passwordEncoder.encode("student123"));
            user.setRole("STUDENT");
            return userRepository.save(user);
        });

        if (!studentRepository.existsByUserId(student.getId())) {
            Student studentProfile = new Student();
            studentProfile.setHoTen("Sinh vien 1");
            studentProfile.setMssv("SV001");
            studentProfile.setUser(student);
            studentRepository.save(studentProfile);
        }
    }
}
