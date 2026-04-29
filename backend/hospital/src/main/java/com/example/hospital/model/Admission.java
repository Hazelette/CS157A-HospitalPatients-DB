package com.example.hospital.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "Admissions")
public class Admission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AdmissionID")
    private Integer admissionID;

    @Column(name = "PatientID")
    private Integer patientID;

    @Column(name = "DoctorID")
    private Integer doctorID;

    @Column(name = "RoomID")
    private Integer roomID;

    @Column(name = "AdmissionDate")
    private LocalDate admissionDate;

    @Column(name = "DischargeDate")
    private LocalDate dischargeDate;

    @Column(name = "Diagnosis")
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