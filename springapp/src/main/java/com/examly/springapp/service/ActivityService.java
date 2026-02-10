package com.examly.springapp.service;

import com.examly.springapp.model.Activity;
import com.examly.springapp.model.Group;
import com.examly.springapp.repository.ActivityRepository;
import com.examly.springapp.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private GroupRepository groupRepository;

    public void logActivity(Long groupId, String message) {
        Group group = groupRepository.findById(groupId).orElse(null);
        if (group != null) {
            Activity activity = new Activity();
            activity.setGroup(group);
            activity.setMessage(message);
            activityRepository.save(activity);
        }
    }
}
