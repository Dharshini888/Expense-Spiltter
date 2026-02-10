package com.examly.springapp.service;

import com.examly.springapp.model.Member;
import com.examly.springapp.model.Notification;
import com.examly.springapp.repository.MemberRepository;
import com.examly.springapp.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private MemberRepository memberRepository;

    public void sendNotification(Long memberId, String message) {
        Member member = memberRepository.findById(memberId).orElse(null);
        if (member != null) {
            Notification notification = new Notification();
            notification.setMember(member);
            notification.setMessage(message);
            notificationRepository.save(notification);
        }
    }
}
