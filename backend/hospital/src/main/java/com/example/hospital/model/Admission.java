package com.example.hospital.model;

import java.time.LocalDate;

public class Admission {

    private Integer admissionID;

    private Integer patientID;

    private Integer doctorID;

    private Integer roomID;

    private LocalDate admissionDate;

    private LocalDate dischargeDate;

    private String diagnosis;

    public Admission() {
    }

    public Integer getAdmissionID() {
        return admissionID;
    }

    public void setAdmissionID(Integer admissionID) {
        this.admissionID = admissionID;
    }

    public Integer getPatientID() {
        return patientID;
    }

    public void setPatientID(Integer patientID) {
        this.patientID = patientID;
    }

    public Integer getDoctorID() {
        return doctorID;
    }

    public void setDoctorID(Integer doctorID) {
        this.doctorID = doctorID;
    }

    public Integer getRoomID() {
        return roomID;
    }

    public void setRoomID(Integer roomID) {
        this.roomID = roomID;
    }

    public LocalDate getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(LocalDate admissionDate) {
        this.admissionDate = admissionDate;
    }

    public LocalDate getDischargeDate() {
        return dischargeDate;
    }

    public void setDischargeDate(LocalDate dischargeDate) {
        this.dischargeDate = dischargeDate;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }
}
